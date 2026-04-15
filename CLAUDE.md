---

Default to using Bun as the package manager and runtime.

- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Use `bun test` instead of `jest` or `vitest`
- Bun automatically loads .env, so don't use dotenv.

## Framework

This project uses **Astro** with React islands for the frontend.

- `bun run dev` -- Start the Astro dev server
- `bun run build` -- Build for production (static output to `dist/`)
- `bun run preview` -- Preview the production build

### Astro Structure

- `src/pages/` -- Astro pages (`.astro` files)
- `src/layouts/` -- Astro layouts
- `src/components/` -- React components (used as islands with `client:only="react"`)
- `src/hooks/` -- React custom hooks
- `src/api/` -- API fetch logic (pure TypeScript, no framework dependency)
- `src/lib/` -- Utility functions
- `src/utils/` -- Date/ID/timezone helpers
- `styles/globals.css` -- Global CSS with Tailwind and CSS variables

### React Islands

The entire dashboard is a single React island (`Dashboard.tsx`) using `client:only="react"` because all data is fetched client-side from the FortuneMusic API.

## Testing

Use `bun test` to run tests.

```ts#index.test.ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

## Deployment

### GitHub Actions CI/CD

This project uses GitHub Actions for automated deployment to GitHub Pages.

**Workflow:** `.github/workflows/release.yml`

The workflow automatically:

- Triggers on push to `main` branch
- Sets up Bun environment
- Installs dependencies with `bun install`
- Builds the project with `bun run build` (Astro build)
- Deploys to GitHub Pages

**Manual deployment:**

```sh
# Build the project
bun run build

# Output will be in ./dist directory
```
