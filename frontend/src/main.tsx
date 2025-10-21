import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Landing from './components/Landing.tsx'
import Booking from './components/Booking.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/home',
    element: <Landing />
  },
  {
    path: '/booking',
    element: <Booking />
  }
])

createRoot(document.getElementById('root')as HTMLElement).render(
  <StrictMode>
    <RouterProvider router = {router} />
  </StrictMode>,
)
