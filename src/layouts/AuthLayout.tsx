import { useEffect, useState } from 'react'
import loginImage from '../assets/images/login.jpg'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../lib/axios'
import { Alert } from '../components/ui/alert'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Checkbox } from '../components/ui/checkbox'
import { Eye, EyeOff } from 'lucide-react'

export const AuthLayout = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/')
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
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
  }

  return (
    <div className="flex h-screen">
      {/* Left Side - Sign In Form */}
      <div className="flex flex-col sm:flex-row w-full lg:w-3/5">
        {/* Header */}
        <div className="flex items-start justify-between p-6 sm:p-8 sm:pl-20">
          <div>
            <h1 className="text-lg font-semibold text-blue-600">AutoSheet</h1>
            <p className="text-sm text-gray-600">ERP System</p>
          </div>
        </div>

        {/* Sign In Form */}
        <div className="flex lg:flex-1 px-5 items-center justify-center lg:-translate-x-20">
          <div className="w-full max-w-md space-y-6">
            <div className="mb-10 sm:mb-4">
              <p className="text-sm text-gray-600">Welcome back!!</p>
              <h2 className="text-3xl font-bold text-gray-900">
                Please Sign In
              </h2>
            </div>

            {error && (
              <Alert variant="destructive">
                <p className="whitespace-nowrap">{error}</p>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-gray-700">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-normal text-gray-700"
                  >
                    Remember me
                  </Label>
                </div>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  I forgot my password
                </a>
              </div>

              <Button
                type="submit"
                className="h-12 w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                Sign In
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-2/5">
        <div className="relative h-screen w-full">
          <img
            src={loginImage}
            alt="Login image"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}
