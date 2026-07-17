#!/usr/bin/env node
/**
 * Lighthouse gate — runs automatically before every `npm run deploy` (npm's
 * `predeploy` hook). There is no remote CI on this repo by choice, so this is
 * the enforced pre-deploy audit: it production-builds the site, serves it
 * locally, audits the homepage with Lighthouse, and BLOCKS the deploy when a
 * category lands below its floor.
 *
 * The floors are regression tripwires, not aspirations — this site audits
 * well above them, so a failure here means something real broke (an
 * unoptimised image, a blocking script, a contrast/labels regression, missing
 * meta). Performance gets headroom because local runs jitter by a few points.
 *
 * Intentional bypass (e.g. auditing is impossible on this machine):
 *   SKIP_LIGHTHOUSE=1 npm run deploy
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";

const PORT = 3099;
const URL = `http://localhost:${PORT}`;
const FLOORS = {
  // Local headless runs jitter and score well below the CDN-served site
  // (baseline measured 82 on a loaded machine); 75 still catches any real
  // regression, which drops double digits.
  performance: 0.75,
  accessibility: 0.9,
  "best-practices": 0.9,
  seo: 0.9,
};

if (process.env.SKIP_LIGHTHOUSE === "1") {
  console.log("⚠ Lighthouse gate skipped (SKIP_LIGHTHOUSE=1).");
  process.exit(0);
}

// Lighthouse needs Chrome; point it at the standard macOS install when the
// env doesn't already say where to look.
const macChrome =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
if (!process.env.CHROME_PATH && existsSync(macChrome)) {
  process.env.CHROME_PATH = macChrome;
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`${cmd} ${args[0]} exited with ${code}`)),
    );
  });
}

console.log("→ Lighthouse gate: production build");
await run("npx", ["next", "build"]);

console.log(`→ Serving the build on :${PORT}`);
const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
  stdio: "ignore",
});

async function waitReady() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(URL);
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(
    `Server on :${PORT} never became ready — is the port already taken?`,
  );
}

const failures = [];
try {
  await waitReady();

  console.log("→ Auditing the homepage");
  mkdirSync(".lighthouse", { recursive: true });
  const report = ".lighthouse/report.json";
  await run("npx", [
    "--yes",
    "lighthouse",
    URL,
    "--output=json",
    `--output-path=${report}`,
    "--only-categories=performance,accessibility,best-practices,seo",
    "--chrome-flags=--headless=new",
    "--quiet",
  ]);

  const { categories } = JSON.parse(readFileSync(report, "utf8"));
  console.log("\nLighthouse scores (floor in brackets):");
  for (const [key, floor] of Object.entries(FLOORS)) {
    const score = categories[key].score;
    const ok = score >= floor;
    console.log(
      `  ${ok ? "✓" : "✗"} ${key}: ${Math.round(score * 100)}  [≥ ${floor * 100}]`,
    );
    if (!ok) failures.push(key);
  }
} finally {
  server.kill("SIGTERM");
}

if (failures.length > 0) {
  console.error(
    `\n✗ Deploy blocked — below floor: ${failures.join(", ")}.` +
      `\n  Fix the regression (full report: .lighthouse/report.json), or use` +
      `\n  SKIP_LIGHTHOUSE=1 npm run deploy only if the drop is understood and intended.`,
  );
  process.exit(1);
}
console.log("\n✓ Lighthouse gate passed — deploying.");
