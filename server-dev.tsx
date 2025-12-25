#!/usr/bin/env bun
/**
 * Development server for testing SSR locally
 * Run with: bun server-dev.tsx
 */

import { serve } from "bun";
import { render } from "./src/entry.server";
import { readFileSync, existsSync } from "fs";
import path from "path";
import pino from "pino";

const logger = pino({
  level: "info",
  timestamp: pino.stdTimeFunctions.isoTime,
});

const PORT = 3000;

logger.info("🚀 Starting SSR development server...");

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);

  // API proxy routes (same as original CSR server)
  if (url.pathname === "/api/events") {
    try {
      const response = await fetch("https://api.fortunemusic.app/v1/appGetEventData/");

      if (!response.ok) {
        return new Response(JSON.stringify({ error: `API returned ${response.status}` }), {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        });
      }

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      logger.error({ err: error }, "Proxy error");
      return new Response(JSON.stringify({ error: "Failed to fetch from FortuneMusic API" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  if (url.pathname === "/api/waitingrooms") {
    try {
      const body = await request.json();
      const response = await fetch("https://meets.fortunemusic.app/lapi/v5/app/dateTimezoneMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Host": "meets.fortunemusic.app",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        return new Response(JSON.stringify({ error: `API returned ${response.status}` }), {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        });
      }

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      logger.error({ err: error }, "Proxy error");
      return new Response(JSON.stringify({ error: "Failed to fetch waiting rooms" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // Serve static assets from dist/assets
  if (url.pathname.startsWith("/assets/")) {
    const filePath = path.join(process.cwd(), "dist", url.pathname);

    if (existsSync(filePath)) {
      const file = Bun.file(filePath);
      return new Response(file);
    }

    return new Response("Not Found", { status: 404 });
  }

  // Handle favicon and other root-level static files
  if (url.pathname === "/favicon.ico" || url.pathname === "/robots.txt" || url.pathname === "/sitemap.xml") {
    // Try to serve from dist/assets
    const filePath = path.join(process.cwd(), "dist/assets", url.pathname);

    if (existsSync(filePath)) {
      const file = Bun.file(filePath);
      return new Response(file);
    }

    // Try to serve from src/assets
    const srcPath = path.join(process.cwd(), "src/assets", url.pathname);

    if (existsSync(srcPath)) {
      const file = Bun.file(srcPath);
      return new Response(file);
    }

    // Return 404 for missing static files (don't route through React Router)
    return new Response("Not Found", { status: 404 });
  }

  // Handle .well-known paths (browser/DevTools requests)
  if (url.pathname.startsWith("/.well-known/")) {
    return new Response("Not Found", { status: 404 });
  }

  // Handle other common browser requests that shouldn't go through React Router
  if (url.pathname === "/manifest.json" || url.pathname.endsWith(".map")) {
    return new Response("Not Found", { status: 404 });
  }

  // Serve SSR for all other routes
  try {
    const response = await render(request);
    return response;
  } catch (error) {
    logger.error({ err: error }, "SSR Error");
    return new Response(
      `<html>
          <head><title>Error</title></head>
          <body>
            <h1>Server Error</h1>
            <pre>${error instanceof Error ? error.message : String(error)}</pre>
          </body>
        </html>`,
      {
        status: 500,
        headers: { "Content-Type": "text/html" },
      }
    );
  }
}

const server = serve({
  port: PORT,
  async fetch(request) {
    const response = await handleRequest(request);
    logger.info({
      method: request.method,
      url: request.url,
      status: response.status,
    }, "Request handled");
    return response;
  },
});

logger.info(`✅ Server running at http://localhost:${PORT}`);
logger.info(`\n📝 Routes:`);
logger.info(`   - http://localhost:${PORT}/`);
logger.info(`   - http://localhost:${PORT}/events/{eventId}/sessions/{sessionId}\n`);
