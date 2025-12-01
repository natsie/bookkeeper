import { $, build, type BuildConfig } from "bun";

const sharedConfig: Partial<BuildConfig> = { minify: true, sourcemap: "linked" };
const configMap: Map<string, BuildConfig> = new Map([
  [
    "node (esm)",
    {
      entrypoints: ["./src/bookkeeper.ts", "./src/node.ts", "./src/browser.ts"],
      naming: {
        entry: `[dir]/[name].mjs`,
      },
      outdir: "./dist/node/esm",
      target: "node",
      format: "esm",
    },
  ],
  [
    "node (cjs)",
    {
      entrypoints: ["./src/bookkeeper.ts", "./src/node.ts", "./src/browser.ts"],
      naming: {
        entry: `[dir]/[name].cjs`,
      },
      outdir: "./dist/node/cjs",
      target: "node",
      format: "cjs",
    },
  ],
  [
    "browser (esm)",
    {
      entrypoints: ["./src/bookkeeper.ts", "./src/browser.ts"],
      naming: {
        entry: `[dir]/[name].mjs`,
      },
      outdir: "./dist/browser/esm",
      target: "browser",
      format: "esm",
    },
  ],
]);

let errorOccurred = false;
const buildOne = async (target: string, config: BuildConfig) => {
  const start = Bun.nanoseconds();
  return await build({ ...sharedConfig, ...config })
    .then((output) => {
      console.log(
        `${target} built in ${((Bun.nanoseconds() - start) / 1e6).toFixed(3)} milliseconds`,
      );
      return output;
    })
    .catch((error) => {
      errorOccurred = true;
      console.log(
        `${target} failed to build after ${((Bun.nanoseconds() - start) / 1e6).toFixed(3)} milliseconds`,
        error,
      );
    });
};

await Promise.all([
  $`bunx tsc`.quiet().catch(() => (console.log("Failed to compile types."), (errorOccurred = !0))),
  ...Array.from(configMap).map(([target, config]) => buildOne(target, config)),
]);
if (errorOccurred) process.exit(1);

console.log("Build complete.");
