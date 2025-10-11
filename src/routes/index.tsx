import { createBrowserRouter } from 'react-router-dom'
import { AuthLayout } from '../layouts/AuthLayout'
import { MainLayout } from '../layouts/MainLayout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [],
  },
  {
    path: '/login',
    element: <AuthLayout />,
  },
])
