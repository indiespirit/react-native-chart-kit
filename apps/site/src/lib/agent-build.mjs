import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { parseHTML } from "linkedom";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import { createOpenApi } from "./agent-openapi.mjs";

export function pageMarkdown(html, url) {
  const { document } = parseHTML(html);
  const main = document.querySelector("main");
  if (!main) throw new Error(`Missing main content: ${url}`);
  main
    .querySelectorAll(
      "script, style, svg, nav, button, video, [aria-hidden='true'], .copy"
    )
    .forEach((node) => node.remove());
  main.querySelectorAll("a[href], img[src]").forEach((node) => {
    const attribute = node.localName === "a" ? "href" : "src";
    const value = node.getAttribute(attribute);
    if (value) node.setAttribute(attribute, new URL(value, url).href);
  });
  const markdown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-"
  });
  markdown.use(gfm);
  // Expressive Code keeps syntax spans inside <pre><code>. Preserve code text.
  markdown.addRule("fencedCode", {
    filter: "pre",
    replacement: (_content, node) => {
      const code = node.querySelector("code");
      const language =
        node.getAttribute("data-language") ??
        code?.getAttribute("data-language") ??
        (node.closest("chart-kit-playground") ? "tsx" : "");
      const lines = (code ?? node).querySelectorAll(".ec-line");
      const text = (
        lines.length
          ? Array.from(lines, (line) => line.textContent).join("\n")
          : (code ?? node).textContent
      ).replace(/\n$/, "");
      const longest = Math.max(
        2,
        ...[...text.matchAll(/`+/g)].map(([run]) => run.length)
      );
      const fence = "`".repeat(longest + 1);
      return `\n\n${fence}${language}\n${text}\n${fence}\n\n`;
    }
  });
  const content = markdown.turndown(main.innerHTML);
  const title =
    document.querySelector("h1")?.textContent.trim() ?? document.title;
  return {
    title,
    markdown: `${content.startsWith("# ") ? "" : `# ${title}\n\n`}${content}\n`
  };
}

async function htmlFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await htmlFiles(filename)));
    else if (entry.name.endsWith(".html")) files.push(filename);
  }
  return files.sort();
}

export async function buildAgentResources(directory) {
  const pages = {};
  for (const filename of await htmlFiles(directory)) {
    const relative = path
      .relative(directory, filename)
      .split(path.sep)
      .join("/");
    if (relative === "404.html" || relative.startsWith("checkout/")) continue;
    const route =
      `/${relative.replace(/(?:^|\/)index\.html$/, "").replace(/\.html$/, "")}`.replace(
        /\/$/,
        ""
      ) || "/";
    const url = `https://chartkit.io${route}`;
    const html = await readFile(filename, "utf8");
    if (html.includes('http-equiv="refresh"')) continue;
    const content = pageMarkdown(html, url + "/");
    const markdownPath = route === "/" ? "/index.md" : `${route}.md`;
    pages[route] = {
      path: route,
      ...content,
      url,
      markdownUrl: `https://chartkit.io${markdownPath}`
    };
    const markdownFile = path.join(directory, markdownPath);
    await mkdir(path.dirname(markdownFile), { recursive: true });
    await writeFile(markdownFile, content.markdown);
  }
  const packageJson = JSON.parse(
    await readFile(new URL("../../../../package.json", import.meta.url), "utf8")
  );
  await writeFile(
    path.join(directory, "openapi.json"),
    JSON.stringify(createOpenApi(packageJson.version), null, 2) + "\n"
  );
  const worker = await readFile(
    new URL("./agent-worker.mjs", import.meta.url),
    "utf8"
  );
  await writeFile(
    path.join(directory, "_worker.js"),
    `${worker}\nexport default createAgentWorker(${JSON.stringify(pages)});\n`
  );
  await writeFile(
    path.join(directory, "_routes.json"),
    JSON.stringify({
      version: 1,
      include: ["/*"],
      exclude: [
        "/_astro/*",
        "/pagefind/*",
        "/images/*",
        "/videos/*",
        "/fonts/*"
      ]
    })
  );
  await writeFile(
    path.join(directory, "llms-full.txt"),
    Object.values(pages)
      .map((page) => `Source: ${page.url}\n\n${page.markdown}`)
      .join("\n---\n\n")
  );
  // Keep a deterministic index available to build and live endpoint checks.
  await writeFile(
    path.join(directory, "agent-pages.json"),
    JSON.stringify(
      Object.values(pages).map(({ path, markdownUrl }) => ({
        path,
        markdownUrl
      }))
    )
  );
  return pages;
}

export const chartKitAgentResources = () => ({
  name: "chart-kit-agent-resources",
  hooks: {
    "astro:build:done": async ({ dir }) => {
      await buildAgentResources(fileURLToPath(dir));
    }
  }
});
