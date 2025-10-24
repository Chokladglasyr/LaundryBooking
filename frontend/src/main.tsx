import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./components/Landing.tsx";
import Booking from "./components/Booking.tsx";
import Rules from "./components/Rules.tsx";
import Admin from "./components/AdminHome.tsx";
import AdminRules from "./components/AdminRules.tsx";
import AdminUsers from "./components/AdminUsers.tsx";
import AdminRooms from "./components/AdminRooms.tsx";
import AdminPosts from "./components/AdminPosts.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "rules", element: <Rules /> },
      { path: "booking", element: <Booking /> },
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
  {
    path: "/home",
    element: <Landing />,
  },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
