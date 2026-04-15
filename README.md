# FortuneMusic Waiting Room

A web application for displaying FortuneMusic event information and waiting room details, built with Astro, React, TypeScript, and Tailwind CSS.

**Live site:** <https://status.meet.oshi-katsu.app>

## Features

- Event browsing and selection
- Waiting room information display with countdown timers
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
bun run dev
```

### Build for Production

```bash
bun run build
```

The built files will be output to the `./dist` directory.

### Preview Production Build

```bash
bun run preview
```

## Deployment

Build the project and deploy the `dist/` folder to any static hosting service.

## Technology Stack

- **Runtime:** [Bun](https://bun.sh)
- **Framework:** [Astro](https://astro.build) 6 (static output) with [React](https://react.dev) 19 islands
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com) 4
- **UI Components:** [shadcn/ui](https://ui.shadcn.com) (Radix UI)
- **HTTP Client:** Axios
- **Date Utilities:** date-fns / date-fns-tz

## Project Structure

```text
├── src/
│   ├── api/fortunemusic/  # API fetch logic
│   ├── components/        # React island components
│   │   └── ui/            # shadcn/ui primitives
│   ├── hooks/             # React custom hooks
│   ├── layouts/           # Astro layouts
│   ├── lib/               # Utility functions
│   ├── pages/             # Astro pages
│   └── utils/             # Date/ID/timezone helpers
├── styles/                # Global CSS
├── public/                # Static assets
└── dist/                  # Build output
```

## License

[MIT](./LICENSE)
