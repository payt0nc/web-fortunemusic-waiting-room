# 46◢ Online Meet Waiting Room

A server-side rendered web application for tracking FortuneMusic event information and waiting room statistics for Sakamichi 46 groups (Nogizaka46, Sakurazaka46, Hinatazaka46).

Built with **Remix**, **Vite**, **Bun**, and **Tailwind CSS**.

## ✨ Features

- 🎯 **Real-time Event Tracking** - Live data from FortuneMusic API
- 📊 **Waiting Room Statistics** - People count and wait times per member
- 🎨 **Responsive Design** - Built with shadcn/ui components
- ⚡ **Server-Side Rendering** - Fast initial page loads with Remix
- 🔄 **Auto-refresh** - Waiting room data updates every 30 seconds
- 🎭 **Multi-Group Support** - Tracks all Sakamichi 46 groups and =LOVE

## 🚀 Development

### Prerequisites

- [Bun](https://bun.sh) v1.0+ runtime installed

### Install Dependencies

```bash
bun install
```

### Start Development Server

```bash
bun run dev
```

The Remix development server will start at `http://localhost:5173` with hot module replacement enabled.

### Run Tests

```bash
bun test
```

### Type Checking

```bash
bun run typecheck
```

### Build for Production

```bash
bun run build
```

The built files will be output to the `./build` directory.

### Run Production Server

```bash
bun run start
```

Starts the production server serving the built application.

## 📦 Deployment

### Automated Deployment (GitHub Actions)

This project is configured with GitHub Actions for automatic deployment to GitHub Pages.

**Setup Instructions:**

1. Go to your GitHub repository settings
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Push to the `main` branch to trigger automatic deployment

The workflow will:

- Install dependencies with Bun
- Build the project with `bun run build`
- Deploy to GitHub Pages
- Make your site available at `https://<username>.github.io/<repository>`

### Manual Deployment

Build the project and deploy the `build` folder to any static hosting service:

```bash
bun run build
# Deploy the ./build directory
```

### CORS Considerations

⚠️ The FortuneMusic API does not support CORS for browser requests. See [DEPLOYMENT.md](./DEPLOYMENT.md) for solutions including CORS proxies and Cloudflare Workers.

## 🛠️ Technology Stack

- **Framework:** [Remix](https://remix.run) v2 - Full-stack web framework
- **Bundler:** [Vite](https://vitejs.dev) - Next generation frontend tooling
- **Runtime:** [Bun](https://bun.sh) - Fast JavaScript runtime (dev & testing)
- **UI Library:** React 19
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Utilities:** date-fns, date-fns-tz

## 📂 Project Structure

```text
app/
├── routes/              # Remix routes (file-based routing)
│   ├── _index.tsx      # Main page (/)
│   └── api.*.ts        # API routes
├── components/          # React components
│   └── ui/             # shadcn/ui components
├── api/                 # External API integrations
│   └── fortunemusic/   # FortuneMusic API client
├── lib/                 # Utility libraries
├── utils/               # Helper functions
├── globals.css          # Global styles
├── root.tsx            # Root layout with meta tags
├── entry.client.tsx    # Client-side entry point
└── entry.server.tsx    # Server-side entry point

public/                  # Static assets (logos, etc.)
.github/
└── workflows/          # GitHub Actions CI/CD
build/                  # Production build output
```

## 📚 Documentation

- [CLAUDE.md](./CLAUDE.md) - Development guidelines and project conventions
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment instructions and CORS handling

## 🙏 Acknowledgments

Built for fans of Nogizaka46 (乃木坂46), Sakurazaka46 (櫻坂46), and Hinatazaka46 (日向坂46).
