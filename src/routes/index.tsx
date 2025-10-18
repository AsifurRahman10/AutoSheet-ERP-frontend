import { createBrowserRouter } from 'react-router-dom'
import { AuthLayout } from '../layouts/AuthLayout'
import { MainLayout } from '../layouts/MainLayout'
import { ManagerUser } from '../pages/admin/ManagerUser'
import { AddUser } from '../pages/admin/AddUser'

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
        path: '/edit-user',
        element: <div>Add User Form</div>,
      },
    ],
  },
  {
    path: '/login',
    element: <AuthLayout />,
  },
])
