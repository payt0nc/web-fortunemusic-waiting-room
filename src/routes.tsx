import type { RouteObject } from "react-router";
import { rootLoader, sessionWaitingRoomLoader } from "./loaders";

// Pages will be created next
import { Layout } from "./components/Layout";
import { WaitingRoomPage } from "./pages/WaitingRoomPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <WaitingRoomPage />,
        loader: rootLoader,
      },
      {
        path: "events/:eventId/sessions/:sessionId",
        element: <WaitingRoomPage />,
        loader: sessionWaitingRoomLoader,
      },
    ],
  },
];
