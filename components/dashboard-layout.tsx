"use client"

import type React from "react"

import { useDeviceType } from "@/hooks/use-device-type"
import { ThemeToggle } from "@/components/theme-toggle"
import { ViewToggle } from "@/components/view-toggle"
import { Button } from "@/components/ui/button"
import { Menu, X, Camera, History, Settings, LogOut, User, Home, ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TeacherIcon } from "./teacher-icon"
import { HandwrittenText } from "./handwritten-text"
import { useTheme } from "next-themes"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { deviceType, isMobile, isDesktop } = useDeviceType()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { theme } = useTheme()

  // Garantir que o tema escuro seja aplicado corretamente
  useEffect(() => {
    // Verificar se o elemento HTML tem a classe 'dark'
    const isDarkMode = document.documentElement.classList.contains("dark")
    // Aplicar classes adicionais se necessário para componentes específicos
    if (isDarkMode) {
      document.body.classList.add("dark-mode-applied")
    } else {
      document.body.classList.remove("dark-mode-applied")
    }
  }, [theme])

  // Verificar autenticação
  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  // Se o usuário não estiver autenticado, não renderize o conteúdo
  if (!user) {
    return null
  }

  // Ajustar os itens de navegação com base no tipo de dispositivo
  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    // Mostrar "Nova Redação" com ícone diferente para desktop
    {
      label: "Nova Redação",
      href: "/scan",
      icon: isDesktop ? FileText : Camera,
      // Descrição diferente baseada no tipo de dispositivo
      description: isDesktop ? "Enviar arquivo de texto" : "Escanear com a câmera",
    },
    { label: "Histórico", href: "/history", icon: History },
    { label: "Configurações", href: "/settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-blue-50/50 dark:bg-slate-900 text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white dark:bg-slate-800 backdrop-blur supports-[backdrop-filter]:bg-white/90 dark:supports-[backdrop-filter]:bg-slate-800/90">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Mostrar botão de voltar apenas se não estiver na página do dashboard */}
            {pathname !== "/dashboard" && (
              <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <TeacherIcon className="group-hover:animate-wiggle" />
              <span className="font-bold text-xl">AvaliAI</span>
              <div className="hidden md:block">
                <HandwrittenText color="green" className="text-sm ml-2 transform -rotate-3">
                  Sala dos Professores
                </HandwrittenText>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <ViewToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar>
                    <AvatarImage src={user.photoURL || ""} alt={user.displayName || "Usuário"} />
                    <AvatarFallback>{user.displayName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <HandwrittenText color="blue">Olá, Professor!</HandwrittenText>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobile && mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40">
            <nav className="flex flex-col p-4 space-y-3 bg-background">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 text-sm font-medium py-2 transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="bg-blue-100 p-1.5 rounded-full">
                    <item.icon className="h-4 w-4 text-blue-600" />
                  </div>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside className="w-64 border-r border-border/40 min-h-[calc(100vh-4rem)] hidden md:block bg-white dark:bg-slate-800">
            <nav className="p-4">
              <div className="space-y-3">
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className={`w-full justify-start rounded-xl hover:bg-blue-50 dark:hover:bg-slate-700 group ${
                      pathname === item.href ? "bg-blue-50 dark:bg-slate-700" : ""
                    }`}
                    onClick={() => router.push(item.href)}
                  >
                    <div className="bg-blue-100 dark:bg-blue-900 p-1.5 rounded-full mr-2 group-hover:bg-blue-200 dark:group-hover:bg-blue-800">
                      <item.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span>{item.label}</span>
                      {item.description && <span className="text-xs text-muted-foreground">{item.description}</span>}
                    </div>
                  </Button>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-slate-700 rounded-xl border border-blue-100 dark:border-slate-600">
                <HandwrittenText color="blue" className="text-lg">
                  Dica do dia:
                </HandwrittenText>
                <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                  {isDesktop
                    ? "Envie arquivos PDF ou DOCX para analisar redações digitadas!"
                    : "Use a câmera para digitalizar redações manuscritas e economizar tempo!"}
                </p>
              </div>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-border/40 z-10">
          <div className="grid grid-cols-4 gap-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className={`flex flex-col items-center py-3 px-0 h-auto rounded-none ${
                  pathname === item.href ? "bg-blue-50/50 dark:bg-slate-700/50" : ""
                }`}
                onClick={() => router.push(item.href)}
              >
                <div className="bg-blue-100 dark:bg-blue-900 p-1.5 rounded-full mb-1">
                  <item.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
