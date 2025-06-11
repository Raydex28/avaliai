"use client"

import type React from "react"

import { WebsiteLayout } from "@/components/website-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react"
import { HandwrittenText } from "@/components/handwritten-text"
import { NotebookCard } from "@/components/notebook-card"

export default function ContactPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulação de envio
    setTimeout(() => {
      toast({
        title: "Mensagem enviada",
        description: "Agradecemos seu contato. Responderemos em breve!",
      })
      setIsSubmitting(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    }, 1500)
  }

  return (
    <WebsiteLayout>
      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-yellow-50 to-white dark:from-slate-900 dark:to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-yellow-100 dark:bg-yellow-900/50 px-3 py-1 text-sm text-yellow-600 dark:text-yellow-300 rotate-1">
                <HandwrittenText>Estamos aqui para ajudar</HandwrittenText>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl relative">
                <span className="highlight-marker">Entre em Contato</span>
                <div className="absolute -top-6 -right-6 text-yellow-400 transform rotate-12 hidden md:block">
                  <HandwrittenText className="text-2xl">Fale conosco!</HandwrittenText>
                </div>
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Estamos aqui para ajudar. Envie-nos uma mensagem e responderemos o mais breve possível.
              </p>
            </div>
            <div className="mx-auto lg:mx-0 relative">
              <div className="relative h-[350px] w-full sm:h-[400px] lg:h-[500px]">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg opacity-10 blur-xl"></div>
                <NotebookCard className="absolute top-4 left-4 w-64 h-64 transform -rotate-6 animate-float" highlight>
                  <HandwrittenText color="purple" className="text-2xl">
                    Dúvidas?
                  </HandwrittenText>
                  <p className="mt-2">Nossa equipe está pronta para ajudar você com qualquer dúvida ou sugestão.</p>
                  <div className="mt-4 flex justify-end">
                    <HandwrittenText color="yellow">Resposta rápida!</HandwrittenText>
                  </div>
                </NotebookCard>

                <div className="relative bg-white dark:bg-slate-800 rounded-lg border shadow-lg p-6 h-full flex items-center justify-center paper-texture">
                  <div className="max-w-md mx-auto w-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <MessageSquare className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                        <span className="font-bold text-lg">Fale Conosco</span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-yellow-100 dark:bg-yellow-900/50 p-2 rounded-full">
                          <Mail className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">Email</h3>
                          <p className="text-muted-foreground">contato@avaliai.com.br</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-full">
                          <Phone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">Telefone</h3>
                          <p className="text-muted-foreground">(13) 9999-9999</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full">
                          <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">Endereço</h3>
                          <p className="text-muted-foreground">
                            Av. Saburo Kameyama, 1005 - Agrochá
                            <br />
                            Registro - SP, 11900-000
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 md:py-24 bg-yellow-50 dark:bg-slate-900/50">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <HandwrittenText color="yellow" className="text-3xl">
              Envie sua Mensagem
            </HandwrittenText>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Formulário de Contato</h2>
            <p className="text-muted-foreground md:text-lg max-w-[700px] mx-auto">
              Preencha o formulário abaixo para entrar em contato com nossa equipe. Estamos ansiosos para ouvir você!
            </p>
          </div>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-6">
              <div className="card-teacher p-6 space-y-4">
                <h2 className="text-2xl font-bold">Fale Conosco</h2>
                <p className="text-muted-foreground">
                  Preencha o formulário ao lado para entrar em contato com nossa equipe. Estamos disponíveis para
                  responder suas dúvidas, fornecer mais informações sobre nossos serviços ou agendar uma demonstração.
                </p>
                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-bold">Email</h3>
                      <p className="text-muted-foreground">contato@avaliai.com.br</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-bold">Telefone</h3>
                      <p className="text-muted-foreground">(11) 9999-9999</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-bold">Endereço</h3>
                      <p className="text-muted-foreground">
                        Av. Saburo Kameyama, 1005 - Agrochá
                        <br />
                        Registro - SP, 11900-000
                      </p>
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <HandwrittenText color="yellow" className="text-xl">
                    Responderemos em até 24h!
                  </HandwrittenText>
                </div>
              </div>
            </div>
            <div className="card-teacher p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Seu nome completo"
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
                    placeholder="seu.email@exemplo.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Select value={formData.subject} onValueChange={handleSelectChange}>
                    <SelectTrigger id="subject" className="h-12">
                      <SelectValue placeholder="Selecione um assunto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Informações Gerais</SelectItem>
                      <SelectItem value="demo">Solicitar Demonstração</SelectItem>
                      <SelectItem value="sales">Vendas</SelectItem>
                      <SelectItem value="support">Suporte Técnico</SelectItem>
                      <SelectItem value="partnership">Parcerias</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Digite sua mensagem aqui..."
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
                <Button type="submit" className="w-full h-12 group" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "Enviando..."
                  ) : (
                    <>
                      Enviar Mensagem
                      <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <HandwrittenText className="text-3xl text-yellow-200">Vamos conversar!</HandwrittenText>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Pronto para Transformar suas Avaliações?
              </h2>
              <p className="md:text-xl">
                Entre em contato hoje mesmo ou crie sua conta gratuita para começar a usar o AvaliAI.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" variant="secondary" className="rounded-full" asChild>
                  <a href="#form">Enviar Mensagem</a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent rounded-full border-white text-white hover:bg-white/10"
                  asChild
                >
                  <a href="/register">Criar Conta Gratuita</a>
                </Button>
              </div>
            </div>
            <div className="mx-auto lg:mx-0 relative">
              <NotebookCard className="transform rotate-3" darkMode>
                <h3 className="text-xl font-bold mb-4 text-blue-300">Perguntas Frequentes:</h3>
                <ul className="space-y-4 text-white">
                  <li>
                    <p className="font-medium">Quanto custa o AvaliAI?</p>
                    <p className="text-sm text-blue-200">O AvaliAI é 100% gratuito para todos os professores.</p>
                  </li>
                  <li>
                    <p className="font-medium">Preciso instalar algum software?</p>
                    <p className="text-sm text-blue-200">Não, o AvaliAI funciona diretamente no navegador.</p>
                  </li>
                  <li>
                    <p className="font-medium">Como funciona a digitalização?</p>
                    <p className="text-sm text-blue-200">Basta tirar uma foto da redação com seu dispositivo.</p>
                  </li>
                </ul>
                <div className="mt-4 text-right">
                  <HandwrittenText color="red" className="text-xl">
                    Estamos aqui para ajudar!
                  </HandwrittenText>
                </div>
              </NotebookCard>
            </div>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  )
}
