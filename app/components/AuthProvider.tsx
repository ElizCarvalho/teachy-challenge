'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

type User = {
  id: string
  name: string
  email: string
  role: string
  schools: string[]
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
})

const publicRoutes = ['/', '/login', '/auth/callback']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check if the user is authenticated on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Call the check-session API route
        const response = await fetch('/api/auth/check-session')
        
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          setUser(null)
          
          // If not on a public route, redirect to login
          if (!publicRoutes.includes(pathname || '')) {
            router.push('/login')
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  // Login function
  const login = () => {
    const defaultRedirect = '/dashboard'
    const clientId = process.env.NEXT_PUBLIC_ZITADEL_CLIENT_ID
    const zitadelUrl = process.env.NEXT_PUBLIC_ZITADEL_URL
    
    // Store the redirect URI in sessionStorage
    sessionStorage.setItem('redirectUri', defaultRedirect)
    
    // Redirect to Zitadel login
    window.location.href = `${zitadelUrl}/oauth/v2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${window.location.origin}/auth/callback&scope=openid profile email`
  }

  // Logout function
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext)
}