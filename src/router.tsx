// src/router.tsx
import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import App from './App'
import Home from './pages/Home'
import DoctorProfile from './pages/DoctorProfile'

// App — root layout (ichida <Outlet/> bo‘lishi shart!)
const rootRoute = createRootRoute({
  component: App,
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',                // faqat bitta '/' bo'ladi
  component: Home,
})

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/doctor/$id',
  component: DoctorProfile,
})

const routeTree = rootRoute.addChildren([homeRoute, profileRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}