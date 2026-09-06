// This module has no runtime dependencies. The build adds the public page data.
export function prefersMarkdown(accept = "") {
  const ranges = accept
    .toLowerCase()
    .split(",")
    .map((part) => {
      const [type, ...parameters] = part.trim().split(";");
      const quality = parameters
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="));
      const q = quality ? Number(quality.slice(2)) : 1;
      return { type, q: Number.isFinite(q) && q >= 0 && q <= 1 ? q : 0 };
    });
  const quality = (type) => {
    for (const pattern of [type, "text/*", "*/*"]) {
      const matches = ranges.filter((range) => range.type === pattern);
      if (matches.length) return Math.max(...matches.map((range) => range.q));
    }
    return 0;
  };
  return (
    ranges.some((range) => range.type === "text/markdown" && range.q > 0) &&
    quality("text/markdown") >= quality("text/html")
  );
}

export function createAgentWorker(pages) {
  const canonicalPath = (path) => path.replace(/\/$/, "") || "/";
  const index = Object.values(pages).map(
    ({ path, title, url, markdownUrl }) => ({ path, title, url, markdownUrl })
  );
  const missing =
    "# Page not found\n\nThis Chart Kit resource does not exist.\n\n- [Agent guide](https://chartkit.io/llms.txt)\n- [Developer docs](https://chartkit.io/developers)\n- [Sitemap](https://chartkit.io/sitemap-index.xml)\n";
  const json = (data, status = 200, headers = {}) =>
    new Response(JSON.stringify(data), {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        ...headers
      }
    });
  const error = (code, message, hint, status, headers) =>
    json({ error: { code, message, hint } }, status, headers);
  return {
    async fetch(request, env) {
      const url = new URL(request.url);
      const path = canonicalPath(url.pathname);
      const api = path === "/api" || path.startsWith("/api/");
      let response;
      if (api) {
        const known = ["/api/v1/docs", "/api/v1/docs/page"].includes(path);
        if (!known)
          response = error(
            "NOT_FOUND",
            "This API endpoint does not exist.",
            "See https://chartkit.io/openapi.json for supported endpoints.",
            404
          );
        else if (!["GET", "HEAD"].includes(request.method))
          response = error(
            "METHOD_NOT_ALLOWED",
            "The documentation API is read-only.",
            "Use GET to read documentation.",
            405,
            { Allow: "GET, HEAD" }
          );
        else if (path === "/api/v1/docs") response = json({ pages: index });
        else {
          const requested = url.searchParams.get("path");
          if (
            !requested ||
            !requested.startsWith("/") ||
            requested.length > 300 ||
            url.searchParams.getAll("path").length !== 1
          ) {
            response = error(
              "INVALID_PATH",
              "Supply one site path of 1 to 300 characters.",
              "Example: /api/v1/docs/page?path=/docs/react-native/charts/line",
              400
            );
          } else {
            const page = pages[canonicalPath(requested)];
            response = page
              ? json(page)
              : error(
                  "NOT_FOUND",
                  "This documentation page does not exist.",
                  "List available pages with GET /api/v1/docs.",
                  404
                );
          }
        }
      } else {
        const page = pages[path];
        const markdownPath =
          path === "/index.md" ? "/" : path.replace(/(?:\/index)?\.md$/, "");
        const markdownPage = path.endsWith(".md")
          ? pages[markdownPath]
          : undefined;
        if (page || markdownPage) {
          if (!["GET", "HEAD"].includes(request.method)) {
            response = error(
              "METHOD_NOT_ALLOWED",
              "This page is read-only.",
              "Use GET to read this page.",
              405,
              { Allow: "GET, HEAD" }
            );
          } else if (
            markdownPage ||
            prefersMarkdown(request.headers.get("Accept") ?? "")
          ) {
            response = new Response((markdownPage ?? page).markdown, {
              headers: { "Content-Type": "text/markdown; charset=utf-8" }
            });
          } else response = await env.ASSETS.fetch(request);
          response = new Response(response.body, response);
          // Do not let the CDN reuse a representation across Accept variants.
          response.headers.set("Cache-Control", "no-store");
          const vary = new Set(
            (response.headers.get("Vary") ?? "")
              .split(",")
              .map((v) => v.trim().toLowerCase())
              .filter(Boolean)
          );
          vary.add("accept");
          vary.add("accept-encoding");
          response.headers.set("Vary", [...vary].join(", "));
          response.headers.set(
            "Link",
            `<${(page ?? markdownPage).markdownUrl}>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"`
          );
        } else {
          response = await env.ASSETS.fetch(request);
          if (response.status === 404)
            response = new Response(missing, {
              status: 404,
              headers: {
                "Content-Type": "text/markdown; charset=utf-8",
                "Cache-Control": "no-store"
              }
            });
        }
      }
      return request.method === "HEAD"
        ? new Response(null, response)
        : response;
    }
  };
}
