
import {
  mkdir,
  copyFile,
  writeFile,
  readFile,
} from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const projectPackage = JSON.parse(
  await readFile(join(root, "package.json"), "utf8")
);

const version = projectPackage.version;
const majorVersion = version.split(".")[0];

const cliDirectory = join(root, "node_modules", "@tailwindcss", "cli");
const cliPackage = JSON.parse(
  await readFile(join(cliDirectory, "package.json"), "utf8")
);

const bin = cliPackage.bin;
const cliRelativePath =
  typeof bin === "string" ? bin : bin?.tailwindcss;

if (!cliRelativePath) {
  throw new Error(
    "Could not find the Tailwind CLI executable in @tailwindcss/cli/package.json."
  );
}

const cliPath = resolve(cliDirectory, cliRelativePath);
const inputCss = join(root, "src", "input.css");
const publicDirectory = join(root, "public");
const outputCss = join(publicDirectory, "tailwind.css");
const versionDirectory = join(publicDirectory, `v${majorVersion}`);

await mkdir(publicDirectory, { recursive: true });
await mkdir(versionDirectory, { recursive: true });

console.log(`Building DameosAI Tailwind CDN v${version}...`);

const result = spawnSync(
  process.execPath,
  [cliPath, "-i", inputCss, "-o", outputCss, "--minify"],
  {
    cwd: root,
    stdio: "inherit",
    shell: false,
  }
);

if (result.error) {
  throw result.error;
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

await copyFile(outputCss, join(versionDirectory, "tailwind.css"));

await writeFile(
  join(publicDirectory, "version.json"),
  JSON.stringify(
    {
      version,
      majorVersion,
      stylesheet: `/v${majorVersion}/tailwind.css`,
    },
    null,
    2
  ) + "\n"
);

console.log("Build successful.");
console.log(`Latest CSS: /tailwind.css`);
console.log(`Versioned CSS: /v${majorVersion}/tailwind.css`);
