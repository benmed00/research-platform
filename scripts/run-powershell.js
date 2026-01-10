#!/usr/bin/env node
/**
 * Cross-platform PowerShell runner.
 *
 * Usage:
 *   node scripts/run-powershell.js <path/to/script.ps1> [-- <ps-args...>]
 *
 * Notes:
 * - On Windows, prefers Windows PowerShell (`powershell.exe`), then PowerShell 7+ (`pwsh.exe`).
 * - On non-Windows, requires PowerShell 7+ (`pwsh`) unless `powershell` is available.
 */
const { spawnSync } = require("node:child_process");
const { existsSync } = require("node:fs");
const path = require("node:path");

function printUsage() {
  // eslint-disable-next-line no-console
  console.error(
    [
      "Usage: node scripts/run-powershell.js <script.ps1> [-- <script args...>]",
      "",
      "Examples:",
      "  npm run db:fix-client",
      "  npm run github:create -- --Username myuser --RepoName myrepo",
      "",
      "If you're on Linux/macOS and don't have PowerShell installed, install PowerShell 7+ (pwsh):",
      "  https://learn.microsoft.com/powershell/scripting/install/installing-powershell",
    ].join("\n"),
  );
}

const [, , scriptArg, ...restArgs] = process.argv;

if (!scriptArg) {
  printUsage();
  process.exit(1);
}

const scriptPath = path.resolve(process.cwd(), scriptArg);
if (!existsSync(scriptPath)) {
  // eslint-disable-next-line no-console
  console.error(`PowerShell script not found: ${scriptPath}`);
  process.exit(1);
}

const isWin = process.platform === "win32";
const candidates = isWin
  ? ["powershell.exe", "pwsh.exe", "powershell", "pwsh"]
  : ["pwsh", "powershell"];

let lastError = null;

for (const cmd of candidates) {
  const result = spawnSync(
    cmd,
    ["-NoLogo", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", scriptPath, ...restArgs],
    { stdio: "inherit" },
  );

  // If the command doesn't exist, try the next candidate.
  if (result.error && result.error.code === "ENOENT") {
    lastError = result.error;
    continue;
  }

  // If it ran, return its exit code.
  process.exit(result.status ?? 1);
}

// eslint-disable-next-line no-console
console.error(
  isWin
    ? "No PowerShell executable found (expected powershell.exe or pwsh.exe)."
    : "PowerShell is required to run this script (expected `pwsh`).",
);
if (lastError) {
  // eslint-disable-next-line no-console
  console.error(String(lastError));
}
printUsage();
process.exit(1);

