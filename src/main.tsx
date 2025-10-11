import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from './theme'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline applies the theme's global styles (including body font) */}
    <CssBaseline />
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </ThemeProvider>
)
