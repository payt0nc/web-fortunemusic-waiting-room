#!/usr/bin/env bun
/**
 * Quick test to verify SSR HTML output includes CSS and JS
 */

import { render } from "./src/entry.server";

console.log("🧪 Testing SSR output...\n");

// Create a mock request
const request = new Request("http://localhost:3000/");

try {
  const response = await render(request);
  const html = await response.text();

  console.log("✅ SSR render completed\n");

  // Check for CSS
  if (html.includes('<link rel="stylesheet" href="/assets/client.css"')) {
    console.log("✅ CSS link found");
  } else {
    console.log("❌ CSS link NOT found");
  }

  // Check for JS
  if (html.includes('<script type="module" src="/assets/client.js"')) {
    console.log("✅ Client JS script found");
  } else {
    console.log("❌ Client JS script NOT found");
  }

  // Check for root div
  if (html.includes('<div id="root">')) {
    console.log("✅ Root div found");
  } else {
    console.log("❌ Root div NOT found");
  }

  // Check for React content
  if (html.includes('class=') || html.includes('className=')) {
    console.log("✅ React components rendered");
  } else {
    console.log("⚠️  No React components detected in HTML");
  }

  console.log("\n📄 HTML Preview (first 500 chars):");
  console.log(html.substring(0, 500) + "...\n");

} catch (error) {
  console.error("❌ SSR test failed:", error);
  process.exit(1);
}
