import { spawn } from "node:child_process";

const PRODUCTION_BRANCH = "main";
const PRODUCTION_DROP_RATES_BASE_URL =
  "https://wraeclast.cards/data/drop-rates";

const isCloudflarePages = process.env.CF_PAGES === "1";
const cloudflareBranch = process.env.CF_PAGES_BRANCH;
const isPreviewBranch =
  isCloudflarePages &&
  Boolean(cloudflareBranch) &&
  cloudflareBranch !== PRODUCTION_BRANCH;

function runPnpm(args, env = process.env) {
  return new Promise((resolve, reject) => {
    const command = process.platform === "win32" ? "cmd.exe" : "pnpm";
    const commandArgs =
      process.platform === "win32" ? ["/d", "/s", "/c", "pnpm", ...args] : args;
    const child = spawn(command, commandArgs, {
      env,
      shell: false,
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`pnpm ${args.join(" ")} failed with exit code ${code}`));
    });
  });
}

const buildEnv = { ...process.env };

if (isPreviewBranch && !buildEnv.VITE_DROP_RATES_BASE_URL) {
  buildEnv.VITE_DROP_RATES_BASE_URL = PRODUCTION_DROP_RATES_BASE_URL;
}

await runPnpm(["build"], buildEnv);

if (isPreviewBranch) {
  console.log(
    `[build:cloudflare] Reusing committed drop-rate data for preview branch "${cloudflareBranch}".`,
  );
} else {
  await runPnpm(["drop-rates:generate"]);
}

await runPnpm(["sitemap:generate"], buildEnv);
