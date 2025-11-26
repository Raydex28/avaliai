"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { PenTool } from "lucide-react"

interface SplashScreenProps {
  children: React.ReactNode
}

export function SplashScreen({ children }: SplashScreenProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const hasShownSplash = sessionStorage.getItem("hasShownSplash")

    if (hasShownSplash) {
      // Se já mostrou, não mostrar novamente
      setIsLoading(false)
      return
    }

    // Mostrar splash por 2 segundos apenas na primeira vez
    const timer = setTimeout(() => {
      setIsLoading(false)
      sessionStorage.setItem("hasShownSplash", "true")
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-yellow-50 to-white dark:from-slate-900 dark:to-background z-50">
        <div className="relative w-80 h-40 mb-6">
          <Image src="/images/quickersoft-logo-clean.png" alt="QuickerSoft" fill className="object-contain" priority />
        </div>
        <div className="flex items-center justify-center mt-4 animate-pulse">
          <PenTool className="h-8 w-8 text-yellow-600 mr-2" />
          <h1 className="text-3xl font-bold text-yellow-600">AvaliAI</h1>
        </div>
        <div className="mt-8">
          <div className="w-16 h-1 bg-yellow-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
