---

## Stack

This project uses **Remix** with **Vite** for server-side rendering (SSR) and **Bun** as the JavaScript runtime.

- **Framework:** Remix v2
- **Bundler:** Vite
- **Runtime:** Bun (for development and testing)
- **UI:** React 19 + Tailwind CSS 4
- **Styling:** Tailwind CSS with shadcn/ui components

## Package Management

Use Bun for all package management:

- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Bun automatically loads .env, so don't use dotenv

## Development

Start the development server with hot module reloading:

```sh
bun run dev
```

This starts the Remix development server using Vite.

## Testing

Use `bun test` to run tests:

```ts#example.test.ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

## Project Structure

```
app/
├── routes/              # Remix routes (file-based routing)
│   ├── _index.tsx      # Main page route
│   └── api.*.ts        # API routes
├── components/          # React components
├── api/                 # External API integrations
├── lib/                 # Utility libraries
├── utils/               # Helper functions
├── globals.css          # Global styles
├── root.tsx            # Root layout with meta tags
├── entry.client.tsx    # Client-side entry point
└── entry.server.tsx    # Server-side entry point

public/                  # Static assets
```

## Remix Conventions

### Routes

Routes are defined in the `app/routes/` directory using file-based routing:

- `_index.tsx` - Main page at `/`
- `api.waiting-rooms.ts` - API endpoint at `/api/waiting-rooms`
- Use loaders for server-side data fetching
- Use actions for form submissions and mutations

Example route with loader:

```tsx#app/routes/example.tsx
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const data = await fetchData();
  return json({ data });
}

export default function Example() {
  const { data } = useLoaderData<typeof loader>();
  return <div>{data}</div>;
}
```

### Data Fetching

- **Server-side:** Use `loader` functions for initial data
- **Client-side:** Use `useFetcher` for progressive enhancement
- **API Routes:** Export `loader` or `action` functions

### SSR Considerations

- Avoid using `localStorage` or `window` outside of `useEffect`
- Serialize non-JSON types (Maps, Sets, Dates) before passing from loaders
- Use `app/utils/transformers.ts` for serialization helpers

## Type Safety

All API types are consolidated in `app/api/fortunemusic/types.ts`:

```tsx
import type { Event, Session, Member, WaitingRoom } from "@/api/fortunemusic/types";
```

## Styling

This project uses Tailwind CSS 4 with the `@tailwindcss/vite` plugin:

- Global styles in `app/globals.css`
- Component styles using Tailwind utility classes
- shadcn/ui components in `app/components/ui/`

## Build & Deployment

### Build

Build the project for production:

```sh
bun run build
```

Output will be in the `build/` directory.

### Start Production Server

Run the production server locally:

```sh
bun run start
```

### GitHub Actions CI/CD

This project uses GitHub Actions for automated deployment to GitHub Pages.

**Workflow:** `.github/workflows/release.yml`

The workflow automatically:

- Triggers on push to `main` branch
- Sets up Bun environment
- Installs dependencies with `bun install`
- Builds the project with `bun run build`
- Deploys to GitHub Pages

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions and CORS handling.

## Additional Resources

- [Remix Documentation](https://remix.run/docs)
- [Vite Documentation](https://vitejs.dev)
- [Bun Documentation](https://bun.sh/docs)
