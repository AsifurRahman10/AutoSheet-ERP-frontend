import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const MainLayout = () => {
  const { user, loading, signOut } = useAuth()
  // signOut()
  if (loading) return <div>Loading...</div>
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return <div>MainLayout</div>
}
