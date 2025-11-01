/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@supabase/auth-js'
import { supabase } from '../lib/supabaseClient.ts'

interface AuthContextType {
  user: User | null
  signUp: (
    email: string,
    password: string
  ) => Promise<{ data: any; error: any }>
  signIn: (
    email: string,
    password: string
  ) => Promise<{ data: any; error: any }>
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => listener?.subscription.unsubscribe()
  }, [])
  const signUp = async (
    email = 'zahinshomik@gmail.com',
    password = '12345678'
  ) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    return { data, error }
  }
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (data.session?.access_token) {
      sessionStorage.setItem('access-Token', data.session.access_token)
    }
    return { data, error }
  }
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    sessionStorage.removeItem('access-Token')
    if (error) {
      throw error
    }
  }
  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
