#!/usr/bin/env bun
import plugin from "bun-plugin-tailwind";
import { existsSync } from "fs";
import { rm, mkdir, cp } from "fs/promises";
import path from "path";

console.log("\n🚀 Starting SSR build process...\n");

const start = performance.now();
const outdir = path.join(process.cwd(), "dist");

// Clean previous build
if (existsSync(outdir)) {
  console.log(`🗑️ Cleaning previous build at ${outdir}`);
  await rm(outdir, { recursive: true, force: true });
}

// Create dist directories
await mkdir(path.join(outdir, "assets"), { recursive: true });

console.log("📦 Building client bundle...\n");

// Build client bundle (for browser)
const clientBuild = await Bun.build({
  entrypoints: ["src/entry.client.tsx"],
  outdir: path.join(outdir, "assets"),
  target: "browser",
  minify: true,
  sourcemap: "linked",
  splitting: true,
  plugins: [plugin],
  naming: {
    entry: "[dir]/client.[ext]",
    chunk: "[dir]/[name]-[hash].[ext]",
    asset: "[dir]/[name]-[hash].[ext]",
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  loader: {
    ".svg": "file",
  },
});

if (!clientBuild.success) {
  console.error("❌ Client build failed:");
  for (const log of clientBuild.logs) {
    console.error(log);
  }
  process.exit(1);
}

console.log("✅ Client bundle built successfully\n");

console.log("📦 Building server bundle (server.js)...\n");

// Build server bundle (for Node.js / AWS Amplify)
const serverBuild = await Bun.build({
  entrypoints: ["server.ts"],
  outdir: outdir,
  target: "node", // Target Node.js for Amplify
  minify: true,
  sourcemap: "linked",
  plugins: [plugin],
  naming: {
    entry: "server.js",
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  loader: {
    ".svg": "file",
  },
  // External dependencies that should NOT be bundled
  // We want to rely on node_modules for server deps in Amplify
  external: ["express", "compression", "pino", "react", "react-dom", "react-router"],
});

if (!serverBuild.success) {
  console.error("❌ Server build failed:");
  for (const log of serverBuild.logs) {
    console.error(log);
  }
  process.exit(1);
}

console.log("✅ Server bundle built successfully\n");

// Copy static assets
console.log("📁 Copying static assets...\n");

try {
  // Copy images directory
  if (existsSync("src/images")) {
    await cp("src/images", path.join(outdir, "assets/images"), {
      recursive: true,
      force: true,
    });
    console.log("✅ Images copied\n");
  }

  // Copy logo as favicon if it exists
  const logoPath = "src/images/logo.svg";
  if (existsSync(logoPath)) {
    await cp(logoPath, path.join(outdir, "favicon.ico"), {
      force: true,
    });
    console.log("✅ Favicon created\n");
  }

  // Create dummy index.html for platform detection (Amplify/others)
  // This satisfies the "No index.html detected" warning
  await Bun.write(path.join(outdir, "index.html"), "<!DOCTYPE html><html><body>SSR App Starting...</body></html>");
  console.log("✅ Dummy index.html created\n");

} catch (err) {
  console.warn("⚠️ Warning: Could not copy static assets:", err);
}

const end = performance.now();
const buildTime = (end - start).toFixed(2);

// Output summary
const formatFileSize = (bytes: number): string => {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

console.log("📊 Build Summary:\n");

const allOutputs = [...clientBuild.outputs, ...serverBuild.outputs];
const outputTable = allOutputs.map(output => ({
  File: path.relative(process.cwd(), output.path),
  Type: output.kind,
  Size: formatFileSize(output.size),
}));

console.table(outputTable);

console.log(`\n✅ SSR build completed in ${buildTime}ms\n`);
console.log("📁 Output directory: dist/");
console.log("  - dist/assets/      (client bundle + static files)");
console.log("  - dist/server.js    (Node.js server for AWS Amplify)\n");
