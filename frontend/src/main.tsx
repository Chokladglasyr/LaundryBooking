import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./components/Landing.tsx";
import Booking from "./components/Booking.tsx";
import Rules from "./components/Rules.tsx";
import Admin from "./components/AdminHome.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "rules", element: <Rules /> },
      { path: "booking", element: <Booking /> },
      { path: "admin", element: <Admin />}
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
