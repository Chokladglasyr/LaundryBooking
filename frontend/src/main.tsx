import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Booking from "./components/Booking.tsx";
import Rules from "./components/Rules.tsx";
import Admin from "./components/AdminHome.tsx";
import AdminRules from "./components/AdminRules.tsx";
import AdminUsers from "./components/AdminUsers.tsx";
import AdminRooms from "./components/AdminRooms.tsx";
import AdminPosts from "./components/AdminPosts.tsx";
import { authLoader, authMiddleware } from "./store/authMiddleware.ts";
import Landing from "./components/Landing.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/home",
    middleware: [authMiddleware],
    loader: authLoader,
    element: <Landing />,
    children: [
      {
        path: "rules",
        middleware: [authMiddleware],
        loader: authLoader,
        element: <Rules />,
      },
      {
        path: "booking",
        middleware: [authMiddleware],
        loader: authLoader,
        element: <Booking />,
      },
    ],
  },
  {
    path: "admin",
    middleware: [authMiddleware],
    loader: authLoader,
    element: <Admin />,
    children: [
      {
        path: "rules",
        element: <AdminRules />,
      },
      {
        path: "posts",
        element: <AdminPosts />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "rooms",
        element: <AdminRooms />,
      },
    ],
  },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
