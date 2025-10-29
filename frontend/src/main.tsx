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
import { authMiddleware } from "./store/authMiddleware.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "rules", middleware: [authMiddleware], element: <Rules /> },
      { path: "booking", middleware: [authMiddleware], element: <Booking /> },
    ],
  },
  {
    path: "/admin",
    element: <Admin />,
    children: [
      {
        path: "rules",
        element: <AdminRules />,
      },
      {
        path: "messages",
        element: <AdminPosts />
      },
      {
        path: "users",
        element: <AdminUsers />
      },
      {
        path: "rooms",
        element: <AdminRooms />
      }
    ],
  },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
