import { createBrowserRouter } from 'react-router-dom'
import { AuthLayout } from '../layouts/AuthLayout'
import { MainLayout } from '../layouts/MainLayout'
import { ManagerUser } from '../pages/User/ManagerUser'
import { AddUser } from '../pages/User/AddUser'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/manage-users',
        element: <ManagerUser />,
      },
      {
        path: '/add-user',
        element: <AddUser />,
      },
      {
        path: '/edit-user/:id',
        element: <AddUser />,
      },
    ],
  },
  {
    path: '/login',
    element: <AuthLayout />,
  },
])
