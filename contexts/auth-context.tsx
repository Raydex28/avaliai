"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se há um usuário no localStorage (simulação de persistência)
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Em uma implementação real, você faria a autenticação com um serviço como Firebase
    // Aqui estamos simulando uma chamada de API
    setIsLoading(true)

    try {
      // Simular atraso de rede
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simular usuário autenticado
      const user: User = {
        uid: `user-${Date.now()}`,
        email,
        displayName: email.split("@")[0],
        photoURL: null,
      }

      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    // Em uma implementação real, você registraria o usuário com um serviço como Firebase
    setIsLoading(true)

    try {
      // Simular atraso de rede
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simular usuário registrado
      const user: User = {
        uid: `user-${Date.now()}`,
        email,
        displayName: name,
        photoURL: null,
      }

      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    // Em uma implementação real, você faria logout com um serviço como Firebase
    setIsLoading(true)

    try {
      // Simular atraso de rede
      await new Promise((resolve) => setTimeout(resolve, 500))

      setUser(null)
      localStorage.removeItem("user")
    } finally {
      setIsLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
