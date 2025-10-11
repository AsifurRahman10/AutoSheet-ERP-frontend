import { createBrowserRouter } from 'react-router-dom'
import { AutoLayout } from '../layouts/AutoLayout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AutoLayout />,
  },
])
