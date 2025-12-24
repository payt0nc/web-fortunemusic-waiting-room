import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import "./globals.css";

export const links: LinksFunction = () => [
  { rel: "icon", href: "/assets/logo.svg", type: "image/svg+xml" },
  { rel: "canonical", href: "https://status.meet.oshi-katsu.app" },
  { rel: "alternate", href: "https://status.meet.oshi-katsu.app", hrefLang: "en" },
  { rel: "alternate", href: "https://status.meet.oshi-katsu.app", hrefLang: "ja" },
  { rel: "alternate", href: "https://status.meet.oshi-katsu.app", hrefLang: "x-default" },
  { rel: "preconnect", href: "https://www.googletagmanager.com" },
  { rel: "dns-prefetch", href: "https://www.googletagmanager.com" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>46◢ Online Meet Waiting Room | Sakamichi 46 Events</title>
        <meta name="description" content="Join the Sakamichi Online Meet for exclusive 46 online meet events. Track live statistics and connect with fellow fans worldwide." />
        <meta name="keywords" content="46, Sakamichi, online meet, waiting room, idol events, Nogizaka46, 乃木坂46, Sakurazaka46, 桜坂46, Hinatazaka46, 日向坂46, virtual events, オンラインミート, ミグリト" />
        <meta name="author" content="46 Online Meet" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="theme-color" content="#000000" />
        
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

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://status.meet.oshi-katsu.app" />
        <meta name="twitter:title" content="46◢ Online Meet Waiting Room" />
        <meta name="twitter:description" content="Join the Sakamichi Online Meet for exclusive 46 online meet events. Track live statistics and connect with fellow fans worldwide." />
        <meta name="twitter:image" content="https://status.meet.oshi-katsu.app/assets/logo.svg" />
        <meta name="twitter:image:alt" content="46◢ Online Meet Waiting Room Logo" />

        <Meta />
        <Links />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
          })
        }} />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-6LV8MY8RLD"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'G-6LV8MY8RLD');
          `
        }} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
