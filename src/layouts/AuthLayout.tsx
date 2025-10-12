import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material'
import { useState } from 'react'
import loginImage from '../assets/images/login.jpg'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../lib/axios'

export const AuthLayout = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [rememberMe, setRememberMe] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn, user } = useAuth()
  const navigate = useNavigate()
  if (user) {
    navigate('/')
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const { data, error } = await signIn(email, password)
    if (error) return setError(error.message)
    const refresh_token = data.session?.refresh_token
    if (!refresh_token) throw new Error('No refresh token returned')
    if (data?.session) {
      await api.post(
        '/auth/session',
        { refresh_token },
        { withCredentials: true }
      )
    }
    if (data?.user) {
      navigate('/')
    }
  }
  return (
    <div className="flex min-h-screen justify-between">
      {/* Left Side - Sign In Form */}
      <div className="flex w-full flex-col justify-between bg-white p-8 lg:w-3/5 lg:p-16">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-blue-600">AutoSheet</h1>
            <p className="text-sm text-gray-600">ERP System</p>
          </div>
          {/* <Button
            variant="outlined"
            sx={{
              borderColor: '#e5e7eb',
              color: '#374151',
              textTransform: 'none',
              borderRadius: '8px',
              px: 3,
              '&:hover': {
                borderColor: '#d1d5db',
                backgroundColor: '#f9fafb',
              },
            }}
          >
            Sign Up
          </Button> */}
        </div>

        {/* Sign In Form */}
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <p className="mb-2 text-gray-700">Welcome back!</p>
            <h2 className="text-3xl font-bold text-dark-gray">
              Please Sign In
            </h2>
          </div>
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius: '8px',
                fontSize: '0.9rem',
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <TextField
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    '& fieldset': {
                      borderColor: '#e5e7eb',
                    },
                    '&:hover fieldset': {
                      borderColor: '#d1d5db',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                    },
                  },
                }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <TextField
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {/* {showPassword ? <VisibilityOff /> : <Visibility />} */}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    '& fieldset': {
                      borderColor: '#e5e7eb',
                    },
                    '&:hover fieldset': {
                      borderColor: '#d1d5db',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                    },
                  },
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{
                      color: '#d1d5db',
                      '&.Mui-checked': {
                        color: '#3b82f6',
                      },
                    }}
                  />
                }
                label={
                  <span className="text-sm text-gray-700">Remember me</span>
                }
              />
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                I forgot my password
              </a>
            </div>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                textTransform: 'none',
                borderRadius: '8px',
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#2563eb',
                },
              }}
            >
              Sign In
            </Button>
          </form>
        </div>

        {/* Footer spacer */}
        <div />
      </div>

      {/* Right Side - Hero Image */}
      <div className="hidden lg:block lg:w-2/5">
        <div className="relative h-full w-full">
          <img
            src={loginImage}
            alt="Login"
            className="h-screen w-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}
