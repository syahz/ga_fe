'use client'

import axiosInstance, { setAccessToken } from '../lib/axios'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Role =
  | 'Staff'
  | 'Manajer Keuangan'
  | 'GM'
  | 'General Affair'
  | 'Kadiv Keuangan'
  | 'Direktur Operasional'
  | 'Direktur Keuangan'
  | 'Direktur Utama'
  | 'Admin'

interface User {
  id: string
  name: string
  email: string
  role: Role
}
interface AuthContextType {
  user: User | null
  login: (accessToken: string, userData: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const { data } = await axiosInstance.post('/auth/refresh')
        setAccessToken(data.accessToken)
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setAccessToken(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkUserStatus()
  }, [])

  const login = (accessToken: string, userData: User) => {
    setAccessToken(accessToken)
    console.log('User data on login:', userData)
    setUser(userData)
    if (userData.role === 'Admin') {
      router.push('/admin/procurements')
    }
  }

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setAccessToken(null)
      setUser(null)
      window.location.href = '/login'
    }
  }

  const value = { user, login, logout, isLoading }

  return <AuthContext.Provider value={value}>{isLoading ? <p>Loading...</p> : children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
