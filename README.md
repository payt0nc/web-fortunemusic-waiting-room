# FortuneMusic Waiting Room

A web application for displaying FortuneMusic event information and waiting room details, built with Bun, React, TypeScript, and Tailwind CSS.

## Features

- Event browsing and selection
- Waiting room information display
- Real-time event data from FortuneMusic API
- Responsive design with shadcn/ui components

## Development

### Prerequisites

- [Bun](https://bun.sh) runtime installed

### Install Dependencies

```bash
bun install
```

### Start Development Server

```bash
bun dev
```

The development server will start with hot module replacement enabled.

### Build for Production

```bash
bun run build
```

The built files will be output to the `./dist` directory.

### Run Production Build

```bash
bun start
```

## Deployment

### Automated Deployment (GitHub Actions)

This project is configured with GitHub Actions for automatic deployment to GitHub Pages.

**Setup Instructions:**

1. Go to your GitHub repository settings
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Push to the `main` branch to trigger automatic deployment

The workflow will:

- Build the project using Bun
- Deploy to GitHub Pages
- Make your site available at `https://<username>.github.io/<repository>`

### Manual Deployment

Build the project and deploy the `dist` folder to any static hosting service:

```bash
bun run build
# Deploy the ./dist directory
```

### CORS Considerations

The FortuneMusic API does not support CORS for browser requests. See [DEPLOYMENT.md](./DEPLOYMENT.md) for solutions including CORS proxies and Cloudflare Workers.

## Technology Stack

- **Runtime:** Bun
- **Framework:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui (Radix UI)
- **Build:** Bun's native bundler

## Project Structure

```text
├── src/
│   ├── api/           # API integration
│   ├── components/    # React components
│   ├── lib/          # Utilities and helpers
│   └── index.html    # Entry point
├── .github/
│   └── workflows/    # GitHub Actions
└── dist/             # Build output
```

## License

This project was created using `bun init` in bun v1.2.19. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
