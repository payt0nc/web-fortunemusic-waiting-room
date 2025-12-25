# Cloudflare Pages Deployment Guide

This guide walks you through deploying your Remix app to Cloudflare Pages.

## Prerequisites

- Node.js or Bun installed
- Cloudflare account (free tier available)
- Git repository (for automatic deployments)

---

## Step 1: Install Wrangler CLI

Wrangler is already installed as a dev dependency. To use it globally:

```bash
bun add -g wrangler
# or
npm install -g wrangler
```

---

## Step 2: Login to Cloudflare

Authenticate with your Cloudflare account:

```bash
wrangler login
```

This will open a browser window to authorize Wrangler.

---

## Step 3: Build Your Application

Build the Remix app for Cloudflare Pages:

```bash
bun run build:cf
```

This creates optimized build artifacts in `./build/client`.

---

## Step 4: Deploy to Cloudflare Pages

### Option A: Deploy Directly (Manual)

Deploy your built application:

```bash
bun run deploy
```

Or use wrangler directly:

```bash
wrangler pages deploy ./build/client --project-name web-fortunemusic-waiting-room
```

### Option B: Connect Git Repository (Recommended)

1. **Push your code to GitHub/GitLab**

2. **Go to Cloudflare Dashboard**
   - Navigate to: https://dash.cloudflare.com
   - Click "Workers & Pages" → "Create application" → "Pages"

3. **Connect your repository**
   - Select "Connect to Git"
   - Choose your repository

4. **Configure build settings:**
   - **Build command:** `bun run build:cf`
   - **Build output directory:** `build/client`
   - **Root directory:** `/` (leave blank)

5. **Click "Save and Deploy"**

---

## Step 5: Configure Environment Variables (Optional)

If you have environment variables, add them in:

1. **Cloudflare Dashboard:**
   - Go to your Pages project
   - Settings → Environment variables
   - Add your variables (e.g., `LOG_LEVEL`, `API_KEY`)

2. **Or via wrangler.toml:**
   Edit `wrangler.toml` and add:
   ```toml
   [env.production.vars]
   LOG_LEVEL = "info"
   ```

---

## Step 6: Test Your Deployment

### Preview Locally with Cloudflare Workers

Test your app with Cloudflare's runtime environment:

```bash
bun run preview
```

### Access Your Live Site

After deployment, Cloudflare will provide a URL:
- **Production:** `https://web-fortunemusic-waiting-room.pages.dev`
- **Custom domain:** Configure in Cloudflare Dashboard → Custom domains

---

## Step 7: Set Up Custom Domain (Optional)

1. Go to your Pages project in Cloudflare Dashboard
2. Click "Custom domains"
3. Add your domain
4. Update your DNS records as instructed

---

## Deployment Commands Reference

| Command | Description |
|---------|-------------|
| `bun run build:cf` | Build for Cloudflare Pages |
| `bun run deploy` | Build and deploy to Cloudflare |
| `bun run preview` | Preview with Cloudflare Workers locally |
| `wrangler pages deploy ./build/client` | Deploy manually |

---

## Automatic Deployments (Git Integration)

Once connected to Git:

✅ **Push to main branch** → Automatic production deployment
✅ **Push to other branches** → Automatic preview deployments
✅ **Pull requests** → Preview deployments with unique URLs

---

## Pricing

### Cloudflare Pages Free Tier:
- ✅ **Unlimited requests**
- ✅ **Unlimited bandwidth**
- ✅ **500 builds/month**
- ✅ **100,000 requests/day** to Workers (for SSR)
- ✅ **Custom domains**
- ✅ **Automatic HTTPS**

**Cost: $0/month** for most small to medium sites!

---

## Troubleshooting

### Build Fails

Check build logs in Cloudflare Dashboard or run locally:
```bash
bun run build:cf
```

### Environment Variables Not Working

Ensure they're set in Cloudflare Dashboard under:
`Settings → Environment variables → Production`

### SSR Not Working

Verify `vite.config.ts` includes Cloudflare Workers runtime config:
```ts
ssr: {
  resolve: {
    conditions: ["workerd", "worker", "browser"],
  },
}
```

---

## Next Steps

1. ✅ Set up automatic deployments via Git
2. ✅ Configure custom domain
3. ✅ Set up environment variables
4. ✅ Monitor analytics in Cloudflare Dashboard

---

## Support

- **Cloudflare Docs:** https://developers.cloudflare.com/pages/
- **Remix + Cloudflare:** https://remix.run/docs/en/main/guides/deployment#cloudflare-pages
- **Wrangler CLI:** https://developers.cloudflare.com/workers/wrangler/
