# Deployment Guide

## Automated Deployment with GitHub Actions

This project includes a GitHub Actions workflow (`.github/workflows/release.yml`) that automatically builds and deploys to GitHub Pages.

### Setup Instructions

1. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - Save the settings

2. **Trigger Deployment:**
   - Push to the `main` branch (automatic)
   - Or manually trigger via **Actions** tab → **Release to GitHub Pages** → **Run workflow**

3. **Access Your Site:**
   - After successful deployment, your site will be available at:
   - `https://<username>.github.io/<repository-name>`

### Workflow Overview

The GitHub Actions workflow performs the following steps:

**Build Job:**

- Checks out the repository
- Sets up Bun runtime (latest version)
- Installs dependencies with `bun install`
- Builds the project with `bun run build`
- Uploads the `dist` folder as a Pages artifact

**Deploy Job:**

- Deploys the artifact to GitHub Pages
- Runs after build completes successfully

### Manual Build

To build locally before deploying:

```bash
# Install dependencies
bun install

# Build the project
bun run build

# The dist/ directory is ready for deployment
```

## CORS Issue

The FortuneMusic API (`https://api.fortunemusic.app`) **does not support CORS**, which means direct API calls from the browser will fail when deployed to GitHub Pages.

## Solutions for GitHub Pages Deployment

### Option 1: Use a CORS Proxy (Quick Solution)

Use a CORS proxy service to bypass CORS restrictions:

**Public CORS Proxies (for development/testing only):**

- `https://corsproxy.io/?` + your API URL
- `https://cors-anywhere.herokuapp.com/` + your API URL

**Update the API URL in `src/api/fortunemusic/events.ts`:**

```typescript
const link = "https://corsproxy.io/?https://api.fortunemusic.app/v1/appGetEventData/"
```

⚠️ **Warning:** Public CORS proxies:

- May have rate limits
- Can be unreliable
- Should not be used in production
- May add latency

### Option 2: Deploy Your Own CORS Proxy

Deploy a simple proxy server that forwards requests:

1. **Use Cloudflare Workers (Free tier available):**
   - Create a worker that proxies requests to FortuneMusic API
   - Deploy it on Cloudflare's edge network
   - Update your app to call the worker URL instead

2. **Use Vercel/Netlify Edge Functions:**
   - Create a serverless function that proxies the API
   - Deploy alongside your static site

Example Cloudflare Worker:

```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Handle events endpoint
    if (url.pathname === '/api/events') {
      const response = await fetch("https://api.fortunemusic.app/v1/appGetEventData/");
      const data = await response.json();

      return new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    // Handle waiting rooms endpoint
    if (url.pathname === '/api/waitingrooms' && request.method === 'POST') {
      const body = await request.json();
      const response = await fetch("https://meets.fortunemusic.app/lapi/v5/app/dateTimezoneMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      return new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    return new Response('Not found', { status: 404 });
  }
}
```

### Option 3: Cache API Responses (Limited Use Case)

If the data doesn't change frequently:

1. Fetch the data manually
2. Store it as a static JSON file in your repo
3. Load from the static file instead of the API

This works if you only need periodic updates.

### Option 4: Hybrid Approach (Recommended for Production)

1. **Local Development:** Use CORS proxy or run a local backend
2. **Production:** Deploy a proper backend API (Cloudflare Workers, Vercel, Railway, etc.)
3. **Configuration:** Use environment variables to switch between endpoints

## Current Implementation

The current code will work in these scenarios:

- ✅ Server-side (Bun backend with proxy)
- ✅ Browser extensions (no CORS restrictions)
- ❌ Direct browser access (GitHub Pages) - **Will fail due to CORS**

## Recommended Deployment Strategy

For **GitHub Pages + free hosting**, I recommend:

1. Deploy static site to GitHub Pages (using the GitHub Actions workflow)
2. Deploy CORS proxy to Cloudflare Workers (free tier)
3. Update `src/api/fortunemusic/events.ts` to use worker URL

This gives you:

- Free hosting for both frontend and backend
- Global CDN distribution
- No CORS issues
- Fast response times
