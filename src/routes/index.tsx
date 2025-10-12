import { createBrowserRouter } from 'react-router-dom'
import { AuthLayout } from '../layouts/AuthLayout'
import { MainLayout } from '../layouts/MainLayout'
import { ManagerUser } from '../pages/admin/ManagerUser'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/manage-users',
        element: <ManagerUser />,
      },
    ],
  },
  {
    path: '/login',
    element: <AuthLayout />,
  },
])
