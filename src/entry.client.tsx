import { hydrateRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { routes } from "./routes";
import "./index.css";

/**
 * Client entry point
 * Hydrates the server-rendered HTML with React
 */

// Create browser router with the same routes used on the server
const router = createBrowserRouter(routes);

// Hydrate the server-rendered HTML
const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

hydrateRoot(
  root,
  <RouterProvider router={router} />
);
