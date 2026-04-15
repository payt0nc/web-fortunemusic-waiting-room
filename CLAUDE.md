---

Default to using Bun as the package manager and runtime.

- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Use `bun test` instead of `jest` or `vitest`
- Bun automatically loads .env, so don't use dotenv.

## Framework

This project uses **Astro 6** with React 19 islands for the frontend. Static output mode (`output: 'static'`).

- `bun run dev` -- Start the Astro dev server
- `bun run build` -- Build for production (static output to `dist/`)
- `bun run preview` -- Preview the production build

### Astro Structure

- `src/pages/` -- Astro pages (`.astro` files)
- `src/layouts/` -- Astro layouts (`BaseLayout.astro`)
- `src/components/` -- React components (used as islands with `client:only="react"`)
- `src/components/ui/` -- shadcn/ui primitives (Radix UI based)
- `src/hooks/` -- React custom hooks (`useEvents`, `useWaitingRooms`, `useCountdown`, `useMediaQuery`)
- `src/api/fortunemusic/` -- API fetch logic (Axios, pure TypeScript)
- `src/lib/` -- Utility functions (`aggregator`, `status-colors`, `utils`)
- `src/utils/` -- Date/ID/timezone helpers
- `styles/globals.css` -- Global CSS with Tailwind 4 and CSS variables

### React Islands

The entire dashboard is a single React island (`Dashboard.tsx`) using `client:only="react"` because all data is fetched client-side from the FortuneMusic API.

### Path Aliases

The project uses `@/*` as a path alias for `./src/*` (configured in `tsconfig.json`).

## Testing

Use `bun test` to run tests. Test files are co-located with source files (e.g., `events.test.ts`, `aggregator.test.ts`).

```ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

## Deployment

The site is deployed at `https://status.meet.oshi-katsu.app`.

### Build

```sh
bun run build
# Output will be in ./dist directory
```

The `dist/` directory can be deployed to any static hosting service.
