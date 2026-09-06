#!/usr/bin/env node
import { realpathSync } from "node:fs";
import { pathToFileURL } from "node:url";

export async function run(
  args,
  { fetchPage = fetch, out = console.log, err = console.error } = {}
) {
  const help =
    "Chart Kit documentation CLI\n\n  chart-kit docs [site-path] [--json]\n\nExamples:\n  chart-kit docs\n  chart-kit docs /docs/react-native/charts/line\n  chart-kit docs /developers --json\n\nReads public documentation from https://chartkit.io. No API key required.\n";
  if (args.length === 0 || ["--help", "-h"].includes(args[0])) {
    out(help);
    return 0;
  }
  const [command, ...rest] = args;
  const paths = rest.filter((arg) => arg !== "--json");
  if (
    command !== "docs" ||
    paths.length > 1 ||
    (paths[0] && (!paths[0].startsWith("/") || paths[0].length > 300))
  ) {
    err(
      JSON.stringify({
        error: {
          code: "INVALID_ARGUMENT",
          message: "Use chart-kit docs [site-path] [--json].",
          hint: "Run chart-kit --help for examples."
        }
      })
    );
    return 1;
  }
  const url = new URL(
    paths[0] ? "/api/v1/docs/page" : "/api/v1/docs",
    "https://chartkit.io"
  );
  if (paths[0]) url.searchParams.set("path", paths[0]);
  try {
    const response = await fetchPage(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(15000)
    });
    if (
      !(response.headers.get("content-type") ?? "").includes("application/json")
    )
      throw new Error("The server did not return JSON.");
    const data = await response.json();
    if (!response.ok) {
      err(JSON.stringify(data));
      return 1;
    }
    out(
      rest.includes("--json")
        ? JSON.stringify(data, null, 2)
        : paths[0]
          ? data.markdown
          : data.pages.map((page) => `${page.path}\t${page.title}`).join("\n")
    );
    return 0;
  } catch (error) {
    err(
      JSON.stringify({
        error: {
          code: "REQUEST_FAILED",
          message: error.message,
          hint: "Check your connection or read https://chartkit.io/llms.txt."
        }
      })
    );
    return 1;
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href
) {
  process.exitCode = await run(process.argv.slice(2));
}
