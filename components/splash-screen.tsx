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
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500) // Mostrar splash por 2.5 segundos

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white z-50">
        <div className="relative w-32 h-32 mb-4">
          {/* Apenas a parte da cabeça do logo */}
          <div className="animate-pulse">
            <Image
              src="/images/quickersoft-head-logo.png"
              alt="QuickerSoft"
              width={128}
              height={128}
              className="object-contain"
              style={{
                clipPath: "polygon(0 0, 40% 0, 40% 100%, 0 100%)",
                transform: "scale(2.5)",
                transformOrigin: "left center",
              }}
            />
          </div>
        </div>
        <div className="flex items-center justify-center mt-4 animate-pulse">
          <PenTool className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-blue-600">AvaliAI</h1>
        </div>
        <div className="mt-8">
          <div className="w-16 h-1 bg-blue-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
