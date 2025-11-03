import { serve } from "bun";
import index from "./index.html";

const server = serve({
  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,
    // Echo console logs from the browser to the server
    console: true,
  },
  routes: {
    // API proxy route to bypass CORS for events
    "/api/events": {
      async GET() {
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
          console.error("Proxy error:", error);
          return new Response(JSON.stringify({ error: "Failed to fetch from FortuneMusic API" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
    // API proxy route to bypass CORS for waiting rooms
    "/api/waitingrooms": {
      async POST(req) {
        try {
          const body = await req.json();
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
          console.error("Proxy error:", error);
          return new Response(JSON.stringify({ error: "Failed to fetch waiting rooms" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
    // Serve index.html for all unmatched routes.
    "/*": index,
  },
});

console.log(`🚀 Server running at ${server.url}`);
