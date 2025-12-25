import { renderToString } from "react-dom/server";
import { createStaticRouter, createStaticHandler, StaticRouterProvider } from "react-router";
import { routes } from "./routes";

/**
 * Server-side render function
 * Called for each request to generate HTML
 */
export async function render(request: Request): Promise<Response> {
  // Create a static handler for SSR data loading
  const handler = createStaticHandler(routes);

  // Fetch data for the route
  const context = await handler.query(request);

  if (context instanceof Response) {
    return context; // This is a redirect or error response
  }

  // Create a static router
  const router = createStaticRouter(handler.dataRoutes, context);

  // Render the app to HTML string
  const html = renderToString(
    <StaticRouterProvider router={router} context={context} />
  );

  // Wrap in HTML shell
  const fullHtml = getHtmlShell(html);

  return new Response(fullHtml, {
    status: context.statusCode || 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=60, s-maxage=300",
    },
  });
}

/**
 * Generate HTML document shell
 * This wraps the React app with proper HTML structure
 */
export function getHtmlShell(content: string): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- SEO Meta Tags -->
  <title>46◢ Online Meet Waiting Room | Sakamichi 46 Events</title>
  <meta name="description" content="Join the Sakamichi Online Meet for exclusive 46 online meet events. Track live statistics and connect with fellow fans worldwide." />
  <meta name="keywords" content="46, Sakamichi, online meet, waiting room, idol events, Nogizaka46, 乃木坂46, Sakurazaka46, 桜坂46, Hinatazaka46, 日向坂46, virtual events, オンラインミート, ミグリト" />
  <meta name="author" content="46 Online Meet" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <meta name="theme-color" content="#000000" />

  <!-- Canonical URL -->
  <link rel="canonical" href="https://status.meet.oshi-katsu.app" />

  <!-- Language Alternates -->
  <link rel="alternate" hreflang="en" href="https://status.meet.oshi-katsu.app" />
  <link rel="alternate" hreflang="ja" href="https://status.meet.oshi-katsu.app" />
  <link rel="alternate" hreflang="x-default" href="https://status.meet.oshi-katsu.app" />

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/assets/images/logo.svg" />

  <!-- Preconnect for Performance -->
  <link rel="preconnect" href="https://www.googletagmanager.com" />
  <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://status.meet.oshi-katsu.app" />
  <meta property="og:title" content="46◢ Online Meet Waiting Room" />
  <meta property="og:description" content="Join the Sakamichi Online Meet for exclusive 46 online meet events. Track live statistics and connect with fellow fans worldwide." />
  <meta property="og:image" content="https://status.meet.oshi-katsu.app/assets/logo.svg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:locale:alternate" content="ja_JP" />
  <meta property="og:site_name" content="46◢ Online Meet" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="https://status.meet.oshi-katsu.app" />
  <meta name="twitter:title" content="46◢ Online Meet Waiting Room" />
  <meta name="twitter:description" content="Join the Sakamichi Online Meet for exclusive 46 online meet events. Track live statistics and connect with fellow fans worldwide." />
  <meta name="twitter:image" content="https://status.meet.oshi-katsu.app/assets/logo.svg" />
  <meta name="twitter:image:alt" content="46◢ Online Meet Waiting Room Logo" />

  <!-- Structured Data (JSON-LD) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "46◢ Online Meet Waiting Room",
    "description": "Join the Sakamichi Online Meet for exclusive 46 online meet events. Track live statistics and connect with fellow fans worldwide.",
    "url": "https://status.meet.oshi-katsu.app/",
    "applicationCategory": "EntertainmentApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY"
    },
    "inLanguage": ["en", "ja"],
    "audience": {
      "@type": "Audience",
      "audienceType": "Fans of Nogizaka46, Sakurazaka46, Hinatazaka46 groups"
    }
  }
  </script>

  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-6LV8MY8RLD"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-6LV8MY8RLD');
  </script>

  <!-- CSS -->
  <link rel="stylesheet" href="/assets/client.css" />
</head>
<body>
  <div id="root">${content}</div>

  <!-- Client JavaScript for hydration -->
  <script type="module" src="/assets/client.js"></script>
</body>
</html>`;
}
