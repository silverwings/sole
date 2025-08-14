// File: contexts/AuthContext.tsx
"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  dateOfBirth: string
  gender: string
  registrationDate: string
  lastLogin: string
  isActive: boolean
  addresses: Address[]
  preferences: UserPreferences
}

export interface Address {
  id: string
  type: 'home' | 'work' | 'other'
  isDefault: boolean
  firstName: string
  lastName: string
  company?: string
  address: string
  city: string
  zipCode: string
  province: string
  country: string
  phone: string
}

export interface UserPreferences {
  newsletter: boolean
  sms: boolean
  language: string
  currency: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateLastLogin: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Carica utente dal localStorage al mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Errore nel caricamento utente salvato:', error)
        localStorage.removeItem('currentUser')
      }
    }
    setIsLoading(false)
  }, [])

  // Salva utente nel localStorage quando cambia
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('currentUser')
    }
  }, [user])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)

      // Password fissa per tutti gli utenti
      const DEMO_PASSWORD = 'demo123'
      
      if (password !== DEMO_PASSWORD) {
        return { success: false, error: 'Password non corretta' }
      }

      // Carica utenti dal JSON
      const response = await fetch('/data/users.json')
      if (!response.ok) {
        throw new Error('Errore nel caricamento utenti')
      }
      
      const data = await response.json()
      const foundUser = data.users.find((u: User) => u.email.toLowerCase() === email.toLowerCase())
      
      if (!foundUser) {
        return { success: false, error: 'Utente non trovato' }
      }

      if (!foundUser.isActive) {
        return { success: false, error: 'Account disattivato' }
      }

      // Aggiorna last login
      const userWithUpdatedLogin = {
        ...foundUser,
        lastLogin: new Date().toISOString()
      }

      setUser(userWithUpdatedLogin)
      return { success: true }

    } catch (error) {
      console.error('Errore durante il login:', error)
      return { success: false, error: 'Errore del server. Riprova più tardi.' }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  const updateLastLogin = () => {
    if (user) {
      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString()
      }
      setUser(updatedUser)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    updateLastLogin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve essere usato all\'interno di un AuthProvider')
  }
  return context
}