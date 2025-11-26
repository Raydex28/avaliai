import type React from "react"
import type { Metadata } from "next"
import { Nunito, Caveat } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { ClassProvider } from "@/contexts/class-context"
import { Toaster } from "@/components/ui/toaster"
import { SplashScreen } from "@/components/splash-screen"

// Fonte principal mais arredondada e amigável
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
})

// Fonte manuscrita para elementos de destaque
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
})

export const metadata: Metadata = {
  title: "AvaliAI - Correção Inteligente de Redações",
  description: "Plataforma para correção de avaliações com assistência de IA",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${nunito.variable} ${caveat.variable}`}>
      <body className="font-nunito min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <ClassProvider>
              <SplashScreen>{children}</SplashScreen>
              <Toaster />
            </ClassProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
