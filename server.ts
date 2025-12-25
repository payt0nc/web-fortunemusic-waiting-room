import { createRequestHandler } from "@remix-run/node";
import { logger } from "./app/lib/logger";

// Import the server build
const build = await import("./build/server/index.js");

const requestHandler = createRequestHandler(build, process.env.NODE_ENV);

const server = Bun.serve({
  port: process.env.PORT || 3000,
  async fetch(request) {
    const start = Date.now();
    const url = new URL(request.url);

    try {
      const response = await requestHandler(request);
      const duration = Date.now() - start;

      // Log the request with RFC3339 timestamp
      logger.info({
        method: request.method,
        url: url.pathname + url.search,
        statusCode: response.status,
        duration,
        msg: `${request.method} ${url.pathname + url.search} ${response.status}`,
      });

      return response;
    } catch (error) {
      const duration = Date.now() - start;

      logger.error({
        method: request.method,
        url: url.pathname + url.search,
        duration,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        msg: "Request failed",
      });

      return new Response("Internal Server Error", { status: 500 });
    }
  },
});

logger.info({
  port: server.port,
  env: process.env.NODE_ENV || "development",
  msg: "Server started",
});
