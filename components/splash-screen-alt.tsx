"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { PenTool } from "lucide-react"
import Image from "next/image"

interface SplashScreenProps {
  children: React.ReactNode
}

export function SplashScreen({ children }: SplashScreenProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500) // Mostrar splash por 2.5 segundos

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white z-50">
        <div className="w-40 h-40 mb-6 flex items-center justify-center">
          <Image
            src="/images/quickersoft-head-logo.png"
            alt="QuickerSoft"
            width={160}
            height={160}
            className="object-contain"
            priority
          />
        </div>
        <div className="flex items-center justify-center animate-pulse">
          <PenTool className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-blue-600">AvaliAI</h1>
        </div>
        <div className="mt-10">
          <div className="w-16 h-1.5 bg-blue-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
