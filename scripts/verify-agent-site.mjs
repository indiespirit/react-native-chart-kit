import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import SwaggerParser from "@apidevtools/swagger-parser";
import { parseHTML } from "linkedom";

const base = process.argv[2] ?? "http://127.0.0.1:8788";
const fetchPath = (path, init) => fetch(new URL(path, base), init);
const expectedPages = JSON.parse(
  await readFile(
    new URL("../apps/site/dist/agent-pages.json", import.meta.url),
    "utf8"
  )
);
let checked = 0;
for (const page of expectedPages) {
  const html = await fetchPath(page.path);
  assert.equal(html.status, 200, page.path);
  assert.match(html.headers.get("content-type"), /text\/html/);
  assert.match(html.headers.get("vary"), /accept/i);
  const body = await html.text();
  assert.equal(
    parseHTML(body).document.querySelectorAll("h1").length,
    1,
    page.path
  );
  if (page.path === "/docs/react-native/charts/line") {
    assert.ok(
      body.includes("chart-kit-playground"),
      "Live playgrounds remain available"
    );
    assert.ok(
      !body.includes("::chart-preview"),
      "Preview directives are transformed"
    );
    assert.ok(
      body.includes(
        "https://github.com/chart-kit/react-native-chart-kit/edit/main/docs/charts/line.md"
      ),
      "Edit source link"
    );
  }
  const markdown = await fetchPath(page.path, {
    headers: { Accept: "text/markdown" }
  });
  assert.equal(markdown.status, 200, page.path);
  assert.match(markdown.headers.get("content-type"), /text\/markdown/);
  assert.match(markdown.headers.get("vary"), /accept/i);
  const text = await markdown.text();
  assert.match(text, /^# /);
  const explicit = await fetchPath(new URL(page.markdownUrl).pathname);
  assert.equal(explicit.status, 200);
  assert.equal(await explicit.text(), text);
  const json = await fetchPath(
    `/api/v1/docs/page?path=${encodeURIComponent(page.path)}`
  );
  assert.equal(json.status, 200);
  assert.equal((await json.json()).markdown, text);
  const head = await fetchPath(page.path, {
    method: "HEAD",
    headers: { Accept: "text/markdown" }
  });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");
  checked += 5;
}
for (const path of [
  "/llms.txt",
  "/llms-full.txt",
  "/agent-instructions.md",
  "/robots.txt",
  "/sitemap-index.xml",
  "/sitemap-0.xml",
  "/openapi.json",
  "/agent-pages.json",
  "/api/v1/docs"
]) {
  const response = await fetchPath(path);
  assert.equal(response.status, 200, path);
  const text = await response.text();
  assert.ok(text.length > 30, path);
  if (path === "/openapi.json") await SwaggerParser.validate(JSON.parse(text));
  if (path === "/robots.txt")
    assert.match(text, /Sitemap: https:\/\/chartkit.io\/sitemap-index.xml/);
  if (path === "/sitemap-0.xml")
    for (const route of ["/about", "/contact", "/developers", "/privacy"])
      assert.ok(text.includes(`https://chartkit.io${route}`), route);
  if (path === "/llms.txt") {
    for (const [, target] of text.matchAll(
      /\]\((https:\/\/chartkit\.io[^)]+)\)/g
    )) {
      assert.equal(
        (await fetchPath(new URL(target).pathname, { method: "HEAD" })).status,
        200,
        target
      );
      checked++;
    }
  }
  checked++;
}
for (const path of [
  "/agent-check-no-such-page",
  "/docs/not-found",
  "/missing.md",
  "/api/missing",
  "/api/v1/docs/page?path=/missing"
]) {
  const response = await fetchPath(path);
  assert.equal(response.status, 404, path);
  assert.match(
    response.headers.get("content-type"),
    path.startsWith("/api/") ? /application\/json/ : /text\/markdown/
  );
  checked++;
}
for (const [path, init, status] of [
  ["/api/v1/docs/page", {}, 400],
  ["/api/v1/docs", { method: "POST" }, 405]
]) {
  const response = await fetchPath(path, init);
  assert.equal(response.status, status);
  assert.ok((await response.json()).error.hint);
  checked++;
}
const home = await (await fetchPath("/")).text();
const { document } = parseHTML(home);
const graph = JSON.parse(
  document.querySelector('script[type="application/ld+json"]').textContent
)["@graph"];
assert.ok(graph.some((entry) => entry["@type"] === "SoftwareApplication"));
assert.ok(
  graph.some(
    (entry) =>
      entry["@type"] === "Organization" && entry.contactPoint && entry.address
  )
);
for (const path of ["/", "/about", "/contact", "/privacy"]) {
  const { document } = parseHTML(await (await fetchPath(path)).text());
  const main = document.querySelector("main");
  main.querySelectorAll("script, style, svg").forEach((node) => node.remove());
  assert.ok(
    main.textContent.replace(/\s+/g, " ").trim().length >= 500,
    `${path} raw HTML content`
  );
}
console.log(`Verified ${expectedPages.length} public pages and ${checked} endpoint checks at ${base}. Checking crawlers next.`);
for (const agent of [
  "GPTBot",
  "ClaudeBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Google-Extended",
  "DeepSeekBot",
  "ora-agent"
]) {
  const response = await fetchPath("/", { headers: { "User-Agent": agent } });
  assert.equal(response.status, 200, agent);
  assert.ok(
    (await response.text()).includes("Beautiful charts for React Native"),
    agent
  );
  checked++;
}
console.log(
  `Verified ${expectedPages.length} public pages in HTML, Markdown, JSON, and HEAD. ${checked} endpoint checks passed at ${base}.`
);
