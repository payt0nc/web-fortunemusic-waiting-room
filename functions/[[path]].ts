import { render } from "../src/entry.server";
import pino from 'pino';

const logger = pino({
  level: 'info',
  browser: {
    asObject: true
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env, context: any) {
    const url = new URL(request.url);
    let response: Response;

    // Helper to log and return
    const respond = (res: Response) => {
      logger.info({
        method: request.method,
        url: request.url,
        status: res.status
      }, "Request handled");
      return res;
    };

    // API proxy routes - proxy to FortuneMusic API
    if (url.pathname === "/api/events") {
      try {
        const apiResponse = await fetch("https://api.fortunemusic.app/v1/appGetEventData/");

        if (!apiResponse.ok) {
          return respond(new Response(JSON.stringify({ error: `API returned ${apiResponse.status}` }), {
            status: apiResponse.status,
            headers: { "Content-Type": "application/json" },
          }));
        }

        const data = await apiResponse.json();
        return respond(new Response(JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }));
      } catch (error) {
        logger.error({ err: error }, "Proxy error");
        return respond(new Response(JSON.stringify({ error: "Failed to fetch from FortuneMusic API" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }));
      }
    }

    if (url.pathname === "/api/waitingrooms") {
      try {
        const body = await request.json();
        const apiResponse = await fetch("https://meets.fortunemusic.app/lapi/v5/app/dateTimezoneMessages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Host": "meets.fortunemusic.app",
          },
          body: JSON.stringify(body),
        });

        if (!apiResponse.ok) {
          return respond(new Response(JSON.stringify({ error: `API returned ${apiResponse.status}` }), {
            status: apiResponse.status,
            headers: { "Content-Type": "application/json" },
          }));
        }

        const data = await apiResponse.json();
        return respond(new Response(JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }));
      } catch (error) {
        logger.error({ err: error }, "Proxy error");
        return respond(new Response(JSON.stringify({ error: "Failed to fetch waiting rooms" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }));
      }
    }

    // Serve static assets directly (JS, CSS, images, etc.)
    if (url.pathname.startsWith("/assets/")) {
      try {
        const asset = await env.ASSETS.fetch(request);
        if (asset.status !== 404) {
          return respond(asset);
        }
      } catch (err) {
        logger.error({ err }, "Asset fetch error");
      }
    }

    // Handle favicon and other root-level static files
    if (url.pathname === "/favicon.ico" || url.pathname === "/robots.txt" || url.pathname === "/sitemap.xml") {
      try {
        const asset = await env.ASSETS.fetch(request);
        if (asset.status !== 404) {
          return respond(asset);
        }
      } catch (err) {
        logger.error({ err }, "Static file fetch error");
      }
      // Return 404 for missing static files (don't route through React Router)
      return respond(new Response("Not Found", { status: 404 }));
    }

    // Handle .well-known paths (browser/DevTools requests)
    if (url.pathname.startsWith("/.well-known/")) {
      return respond(new Response("Not Found", { status: 404 }));
    }

    // Handle other common browser requests that shouldn't go through React Router
    if (url.pathname === "/manifest.json" || url.pathname.endsWith(".map")) {
      return respond(new Response("Not Found", { status: 404 }));
    }

    // For all other routes, use SSR
    try {
      const response = await render(request);
      return respond(response);
    } catch (error) {
      logger.error({ err: error }, "SSR Error");

      // Fallback error page
      return respond(new Response(
        `
<!DOCTYPE html>
<html>
<head>
  <title>Error</title>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
  <h1>Server Error</h1>
  <p>An error occurred while rendering this page.</p>
  <p>Please try again later.</p>
</body>
</html>
        `,
        {
          status: 500,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }
      ));
    }
  }
};
