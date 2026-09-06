import { mkdtempSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

describe("npm CLI executable", () => {
  it("runs through the symlink created by npm and returns useful exit codes", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "chartkit-cli-entry-"));
    const link = path.join(directory, "chart-kit");
    try {
      symlinkSync(
        fileURLToPath(new URL("../bin/chart-kit.mjs", import.meta.url)),
        link
      );
      const help = spawnSync(process.execPath, [link, "--help"], {
        encoding: "utf8"
      });
      expect(help.status).toBe(0);
      expect(help.stdout).toContain("Chart Kit documentation CLI");
      const invalid = spawnSync(process.execPath, [link, "unknown"], {
        encoding: "utf8"
      });
      expect(invalid.status).toBe(1);
      expect(JSON.parse(invalid.stderr).error.code).toBe("INVALID_ARGUMENT");
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
