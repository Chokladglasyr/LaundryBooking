import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/home',
    element: <Home />
  }
])

createRoot(document.getElementById('root')as HTMLElement).render(
  <StrictMode>
    <RouterProvider router = {router} />
  </StrictMode>,
)
