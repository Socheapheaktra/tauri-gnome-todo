import { build } from "esbuild";
import { existsSync } from "node:fs";
import { rm, readdir } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(rootDir, "src");
const outDir = join(rootDir, ".test-output");

async function findTests(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const tests = await Promise.all(
    entries.map(async (entry) => {
      const path = join(dir, entry.name);

      if (entry.isDirectory()) {
        return findTests(path);
      }

      return entry.isFile() && /\.(test)\.tsx?$/.test(entry.name) ? [path] : [];
    })
  );

  return tests.flat();
}

const aliasPlugin = {
  name: "tsconfig-path-alias",
  setup(buildContext) {
    buildContext.onResolve({ filter: /^@\// }, (args) => {
      const path = join(srcDir, args.path.slice(2));
      const resolvedPath = resolveTsPath(path);

      return { path: resolvedPath };
    });
  }
};

function resolveTsPath(path) {
  const candidates = [
    path,
    `${path}.ts`,
    `${path}.tsx`,
    `${path}.js`,
    join(path, "index.ts"),
    join(path, "index.tsx")
  ];

  return candidates.find((candidate) => existsSync(candidate)) ?? path;
}

const testFiles = await findTests(srcDir);

if (testFiles.length === 0) {
  console.log("No test files found.");
  process.exit(0);
}

await rm(outDir, { force: true, recursive: true });

await build({
  bundle: true,
  entryNames: "[dir]/[name]",
  entryPoints: testFiles,
  external: ["lucide-react", "react", "react-dom", "react-dom/server"],
  format: "esm",
  jsx: "automatic",
  logLevel: "silent",
  outbase: srcDir,
  outdir: outDir,
  platform: "node",
  plugins: [aliasPlugin],
  sourcemap: "inline",
  target: "node22"
});

const compiledTests = testFiles.map((file) =>
  join(outDir, relative(srcDir, file).replace(/\.tsx?$/, ".js"))
);

const testProcess = spawn(process.execPath, ["--test", ...compiledTests], {
  stdio: "inherit"
});

testProcess.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
