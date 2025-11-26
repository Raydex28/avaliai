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
import { UserPlus } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const { register, user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // Se o usuário já está autenticado, mostrar mensagem e botão para ir ao dashboard
  if (user) {
    return (
      <WebsiteLayout>
        <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center">
              <Card className="card-teacher border-2 max-w-md w-full">
                <CardContent className="space-y-4 pt-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Você já está conectado!</h2>
                    <p className="text-muted-foreground">Você já tem uma conta e está autenticado no sistema.</p>
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

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Senhas não coincidem",
        description: "Por favor, verifique se as senhas são idênticas.",
      })
      return
    }

    setIsLoading(true)

    try {
      await register(formData.email, formData.password, formData.name)
      toast({
        title: "Conta criada com sucesso",
        description: "Você foi registrado e está conectado.",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: "Ocorreu um erro ao registrar sua conta. Tente novamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <WebsiteLayout>
      <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center">
            <div className="text-center space-y-4 mb-8">
              <div className="inline-block rounded-lg bg-blue-100 dark:bg-blue-900/50 px-3 py-1 text-sm text-blue-600 dark:text-blue-300 rotate-1 mb-2">
                <HandwrittenText>Junte-se a nós</HandwrittenText>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                <span className="highlight-marker">Criar Conta</span>
              </h1>
              <p className="text-muted-foreground md:text-xl max-w-[600px] mx-auto">
                Crie sua conta gratuita e comece a usar o AvaliAI para transformar sua forma de avaliar redações.
              </p>
            </div>

            <div className="w-full max-w-md">
              <Card className="card-teacher border-2">
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4 pt-6">
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold">Crie sua conta gratuita</h2>
                      <p className="text-sm text-muted-foreground">Preencha os dados abaixo para começar</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="João Silva"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="h-12"
                      />
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
                      <Label htmlFor="password">Senha</Label>
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
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="h-12"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full h-12 group" disabled={isLoading}>
                      {isLoading ? (
                        "Criando conta..."
                      ) : (
                        <>
                          Criar Conta
                          <UserPlus className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                    <div className="text-center text-sm">
                      Já tem uma conta?{" "}
                      <Link href="/login" className="text-primary hover:underline">
                        Faça login
                      </Link>
                    </div>
                  </CardFooter>
                </form>
              </Card>
              <div className="mt-6 text-center">
                <HandwrittenText color="green" className="text-lg">
                  É 100% gratuito!
                </HandwrittenText>
              </div>
            </div>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  )
}
