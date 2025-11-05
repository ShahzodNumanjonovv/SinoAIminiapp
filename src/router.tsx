// src/router.tsx
import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import App from './App'
import Home from './pages/Home'
import DoctorProfile from './pages/DoctorProfile'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import Search from './pages/Search'
import ChatRoom from './pages/ChatRoom'

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

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat',
  component: Chat,
})

const profileTabRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: Profile,
})

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search',
  component: Search,
})

const chatRoomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat/$sid',
  component: ChatRoom,
})

const routeTree = rootRoute.addChildren([homeRoute, profileRoute, chatRoute, profileTabRoute, searchRoute, chatRoomRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
