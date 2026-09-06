import { describe, expect, it, vi } from "vitest";
import SwaggerParser from "@apidevtools/swagger-parser";
import {
  createAgentWorker,
  prefersMarkdown
} from "../apps/site/src/lib/agent-worker.mjs";
import { createOpenApi } from "../apps/site/src/lib/agent-openapi.mjs";
import { pageMarkdown } from "../apps/site/src/lib/agent-build.mjs";
import { run } from "../bin/chart-kit.mjs";

const pages = {
  "/": {
    path: "/",
    title: "Chart Kit",
    url: "https://chartkit.io/",
    markdownUrl: "https://chartkit.io/index.md",
    markdown: "# Chart Kit\n\nRender charts locally.\n"
  }
};
const worker = createAgentWorker(pages);
const env = {
  ASSETS: {
    fetch: async (request) =>
      new Response(
        new URL(request.url).pathname === "/"
          ? "<h1>Chart Kit</h1>"
          : "not found",
        {
          status: new URL(request.url).pathname === "/" ? 200 : 404,
          headers: { "Content-Type": "text/html", Vary: "Origin" }
        }
      )
  }
};
const get = (path, init) =>
  worker.fetch(new Request(`https://chartkit.io${path}`, init), env);

describe("Chart Kit agent HTTP contract", () => {
  it.each([
    "text/markdown",
    "text/markdown, text/html",
    "text/html;q=0.5, text/markdown;q=0.9",
    "text/markdown;q=0.5, text/*;q=0.2",
    "TEXT/MARKDOWN; charset=utf-8"
  ])("negotiates %s", (accept) => expect(prefersMarkdown(accept)).toBe(true));
  it.each([
    "",
    "*/*",
    "text/html",
    "text/markdown;q=0",
    "text/html, text/markdown;q=0.5",
    "text/markdown;q=bogus",
    "text/markdown;q=2"
  ])("keeps HTML for %s", (accept) =>
    expect(prefersMarkdown(accept)).toBe(false)
  );
  it.each(["text/html", "text/markdown"])(
    "declares Vary for %s",
    async (accept) => {
      const response = await get("/", { headers: { Accept: accept } });
      expect(response.headers.get("Vary")).toContain("accept");
      expect(response.headers.get("Content-Type")).toContain(accept);
      expect(response.headers.get("Cache-Control")).toBe("no-store");
      expect(response.headers.get("Link")).toContain('rel="describedby"');
    }
  );
  it("preserves other Vary fields", async () =>
    expect((await get("/")).headers.get("Vary")).toContain("origin"));
  it("returns equivalent Markdown at the explicit URL", async () =>
    expect(await (await get("/index.md")).text()).toBe(pages["/"].markdown));
  it("returns a real Markdown 404 with discovery links", async () => {
    const response = await get("/no-such-page");
    expect(response.status).toBe(404);
    expect(response.headers.get("Content-Type")).toContain("text/markdown");
    expect(await response.text()).toContain("https://chartkit.io/llms.txt");
  });
  it("lists and reads public pages", async () => {
    expect((await (await get("/api/v1/docs")).json()).pages).toHaveLength(1);
    expect(await (await get("/api/v1/docs/page?path=/")).json()).toEqual(
      pages["/"]
    );
  });
  it.each([
    "",
    "?path=https://example.com",
    "?path=/&path=/",
    `?path=/${"a".repeat(301)}`
  ])("rejects invalid path %s", async (query) => {
    const response = await get(`/api/v1/docs/page${query}`);
    expect(response.status).toBe(400);
    expect((await response.json()).error).toMatchObject({
      code: "INVALID_PATH",
      hint: expect.any(String)
    });
  });
  it.each(["/api/missing", "/api/v1/docs/page?path=/missing"])(
    "returns JSON 404 at %s",
    async (path) => {
      const response = await get(path);
      expect(response.status).toBe(404);
      expect((await response.json()).error.code).toBe("NOT_FOUND");
    }
  );
  it("rejects writes with a method hint", async () => {
    const response = await get("/api/v1/docs", { method: "POST" });
    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toBe("GET, HEAD");
    expect((await response.json()).error.code).toBe("METHOD_NOT_ALLOWED");
  });
  it.each(["/", "/index.md", "/api/v1/docs", "/api/missing", "/missing"])(
    "omits HEAD bodies at %s",
    async (path) =>
      expect(await (await get(path, { method: "HEAD" })).text()).toBe("")
  );
  it("validates the OpenAPI document and unique operation IDs", async () => {
    const spec = createOpenApi("7.0.3");
    await SwaggerParser.validate(spec);
    const operations = Object.values(spec.paths).map((path) => path.get);
    expect(new Set(operations.map((op) => op.operationId)).size).toBe(
      operations.length
    );
    expect(
      operations.every((op) => op.description && op.responses["200"])
    ).toBe(true);
  });
  it("preserves line breaks in syntax-highlighted code", () => {
    const result = pageMarkdown(
      '<html><main><h1>Code</h1><pre data-language="ts"><code><div class="ec-line">// comment</div><div class="ec-line">const x = 1;</div></code></pre></main></html>',
      "https://chartkit.io/"
    );
    expect(result.markdown).toContain("// comment\nconst x = 1;");
  });
  it("keeps headings, tables, links, and code in Markdown without decorative markup", () => {
    const result = pageMarkdown(
      '<html><title>Chart Kit</title><main><h1>Chart Kit</h1><h2>Example</h2><a href="/developers">Docs</a><pre data-language="tsx"><code>const x = &lt;LineChart /&gt;;</code></pre><table><thead><tr><th>Prop</th></tr></thead><tbody><tr><td>data</td></tr></tbody></table><svg><text>Decoration</text></svg><script>bad()</script></main></html>',
      "https://chartkit.io/"
    );
    expect(result.markdown).toContain("## Example");
    expect(result.markdown).toContain("[Docs](https://chartkit.io/developers)");
    expect(result.markdown).toContain("```tsx\nconst x = <LineChart />;\n```");
    expect(result.markdown).toContain("| Prop |");
    expect(result.markdown).not.toMatch(/Decoration|bad\(\)/);
  });
});

describe("official documentation CLI", () => {
  const setup = () => ({
    out: vi.fn(),
    err: vi.fn(),
    fetchPage: vi.fn((url, init) => worker.fetch(new Request(url, init), env))
  });
  it("prints help without a network request", async () => {
    const io = setup();
    expect(await run(["--help"], io)).toBe(0);
    expect(io.fetchPage).not.toHaveBeenCalled();
  });
  it("lists pages", async () => {
    const io = setup();
    expect(await run(["docs"], io)).toBe(0);
    expect(io.out).toHaveBeenCalledWith("/\tChart Kit");
  });
  it("prints Markdown", async () => {
    const io = setup();
    expect(await run(["docs", "/"], io)).toBe(0);
    expect(io.out).toHaveBeenCalledWith(pages["/"].markdown);
  });
  it("prints JSON", async () => {
    const io = setup();
    expect(await run(["docs", "/", "--json"], io)).toBe(0);
    expect(JSON.parse(io.out.mock.calls[0][0])).toEqual(pages["/"]);
  });
  it("reports an API error and nonzero exit", async () => {
    const io = setup();
    expect(await run(["docs", "/missing"], io)).toBe(1);
    expect(JSON.parse(io.err.mock.calls[0][0]).error.code).toBe("NOT_FOUND");
  });
  it("rejects an unknown command", async () => {
    const io = setup();
    expect(await run(["render"], io)).toBe(1);
    expect(io.fetchPage).not.toHaveBeenCalled();
  });
  it("reports network errors", async () => {
    const io = setup();
    io.fetchPage.mockRejectedValue(new Error("offline"));
    expect(await run(["docs"], io)).toBe(1);
    expect(JSON.parse(io.err.mock.calls[0][0]).error.code).toBe(
      "REQUEST_FAILED"
    );
  });
  it("rejects an HTML challenge response", async () => {
    const io = setup();
    io.fetchPage.mockResolvedValue(
      new Response("challenge", { headers: { "Content-Type": "text/html" } })
    );
    expect(await run(["docs"], io)).toBe(1);
  });
});
