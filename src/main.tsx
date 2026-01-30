import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { OrderProvider } from './state/OrderContext'
import './index.css'
import { router } from './app/routes'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/pupas/sw.js', { scope: '/pupas/' }).catch(() => {})
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OrderProvider>
      <RouterProvider router={router} />
    </OrderProvider>
  </StrictMode>
)
