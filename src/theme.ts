import { createTheme } from '@mui/material'

export const theme = createTheme({
  typography: {
    fontFamily: 'Inter, Poppins, sans-serif',
    h1: { fontFamily: 'Poppins, sans-serif', fontWeight: 700 },
    h2: { fontFamily: 'Poppins, sans-serif', fontWeight: 600 },
    body1: { fontFamily: 'Inter, sans-serif' },
  },
  palette: {
    grey: {
      900: '#272525',
    },
  },
})
