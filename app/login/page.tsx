"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { WebsiteLayout } from "@/components/website-layout"
import { HandwrittenText } from "@/components/handwritten-text"
import { LogIn } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login, user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Se o usuário já está autenticado, mostrar mensagem e botão para ir ao dashboard
  if (user) {
    return (
      <WebsiteLayout>
        <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-yellow-50 to-white dark:from-slate-900 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center">
              <Card className="card-teacher border-2 max-w-md w-full">
                <CardContent className="space-y-4 pt-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Você já está conectado!</h2>
                    <p className="text-muted-foreground">Você já está autenticado no sistema.</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => router.push("/dashboard")} className="w-full h-12">
                    Ir para o Dashboard
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </WebsiteLayout>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(formData.email, formData.password)
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: "Email ou senha incorretos. Tente novamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <WebsiteLayout>
      <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-yellow-50 to-white dark:from-slate-900 dark:to-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center">
            <div className="text-center space-y-4 mb-8">
              <div className="inline-block rounded-lg bg-yellow-100 dark:bg-yellow-900/50 px-3 py-1 text-sm text-yellow-600 dark:text-yellow-300 rotate-1 mb-2">
                <HandwrittenText>Área do Professor</HandwrittenText>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                <span className="highlight-marker">Acesso ao Sistema</span>
              </h1>
              <p className="text-muted-foreground md:text-xl max-w-[600px] mx-auto">
                Entre com suas credenciais para acessar o AvaliAI e transformar sua forma de avaliar redações.
              </p>
            </div>

            <div className="w-full max-w-md">
              <Card className="card-teacher border-2">
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4 pt-6">
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold">Bem-vindo de volta!</h2>
                      <p className="text-sm text-muted-foreground">Entre com suas credenciais para continuar</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="professor@escola.edu.br"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Senha</Label>
                        <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                          Esqueceu a senha?
                        </Link>
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="h-12"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full h-12 group" disabled={isLoading}>
                      {isLoading ? (
                        "Entrando..."
                      ) : (
                        <>
                          Entrar
                          <LogIn className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                    <div className="text-center text-sm">
                      Não tem uma conta?{" "}
                      <Link href="/register" className="text-primary hover:underline">
                        Registre-se
                      </Link>
                    </div>
                  </CardFooter>
                </form>
              </Card>
              <div className="mt-6 text-center">
                <HandwrittenText color="yellow" className="text-lg">
                  Transforme sua forma de avaliar redações!
                </HandwrittenText>
              </div>
            </div>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  )
}
