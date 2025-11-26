"use client"

import type React from "react"

import { useDeviceType } from "@/hooks/use-device-type"
import { ViewToggle } from "@/components/view-toggle"
import { Button } from "@/components/ui/button"
import { Menu, X, GraduationCap, BookOpen, Sun, Moon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
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

interface WebsiteLayoutProps {
  children: React.ReactNode
}

export function WebsiteLayout({ children }: WebsiteLayoutProps) {
  const { deviceType, isMobile } = useDeviceType()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const navItems = [
    { label: "Início", href: "/" },
    { label: "Recursos", href: "/features" },
    { label: "Contato", href: "/contact" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <TeacherIcon className="group-hover:animate-wiggle" />
              <span className="font-bold text-xl">AvaliAI</span>
              <div className="hidden md:block">
                <HandwrittenText color="yellow" size="lg" className="ml-2 transform -rotate-3">
                  Seu assistente de correção!
                </HandwrittenText>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 transition-all group-hover:w-full"></span>
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Alternar tema"
              className="dark-mode-toggle"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <ViewToggle />

            {user ? (
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
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" className="rounded-full" onClick={() => router.push("/login")}>
                  Entrar
                </Button>
                <Button className="rounded-full" onClick={() => router.push("/register")}>
                  Registrar
                </Button>
              </div>
            )}

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
                  className="text-sm font-medium py-2 transition-colors hover:text-primary flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-yellow-50 dark:bg-slate-900/50">
        <div className="container py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TeacherIcon />
                <span className="font-bold text-lg text-foreground">AvaliAI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Plataforma gratuita de avaliação de redações com inteligência artificial.
              </p>
              <HandwrittenText color="yellow" size="xl">
                Feito com ❤️ para professores!
              </HandwrittenText>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-foreground">Navegação</h3>
              <ul className="space-y-2 text-sm">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-muted-foreground hover:text-foreground flex items-center">
                      <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-foreground">Recursos</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/features" className="text-muted-foreground hover:text-foreground flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                    Correção de Redações
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="text-muted-foreground hover:text-foreground flex items-center">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                    Análise de Competências
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="text-muted-foreground hover:text-foreground flex items-center">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                    Feedback Detalhado
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="text-muted-foreground hover:text-foreground flex items-center">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                    Estatísticas e Relatórios
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-foreground">Contato</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-muted-foreground">contato@avaliai.com.br</li>
                <li className="text-muted-foreground">(11) 9999-9999</li>
                <li className="text-muted-foreground">São Paulo, SP</li>
              </ul>
              <div className="mt-4">
                <HandwrittenText color="purple" size="lg">
                  Fale conosco!
                </HandwrittenText>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} AvaliAI. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground">
                Termos de Uso
              </Link>
              <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground">
                Política de Privacidade
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
