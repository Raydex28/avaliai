"use client"

import { WebsiteLayout } from "@/components/website-layout"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HandwrittenText } from "@/components/handwritten-text"
import { NotebookCard } from "@/components/notebook-card"
import { TeacherIcon } from "@/components/teacher-icon"

export default function AboutPage() {
  return (
    <WebsiteLayout>
      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-blue-100 dark:bg-blue-900/50 px-3 py-1 text-sm text-blue-600 dark:text-blue-300 rotate-1">
                <HandwrittenText>Conheça nossa história</HandwrittenText>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl relative">
                <span className="highlight-marker">Sobre o AvaliAI</span>
                <div className="absolute -top-6 -right-6 text-blue-400 transform rotate-12 hidden md:block">
                  <HandwrittenText className="text-2xl">Nossa missão!</HandwrittenText>
                </div>
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Conheça nossa missão de transformar a avaliação de redações com tecnologia de inteligência artificial.
              </p>
            </div>
            <div className="mx-auto lg:mx-0 relative">
              <div className="relative h-[350px] w-full sm:h-[400px] lg:h-[500px]">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-10 blur-xl"></div>
                <NotebookCard className="absolute top-4 left-4 w-64 h-64 transform -rotate-6 animate-float" highlight>
                  <HandwrittenText color="blue" className="text-2xl">
                    Nossa Missão
                  </HandwrittenText>
                  <p className="mt-2">
                    Transformar a educação através da tecnologia, tornando a avaliação de redações mais eficiente e
                    acessível.
                  </p>
                </NotebookCard>

                <div className="relative bg-white dark:bg-slate-800 rounded-lg border shadow-lg p-6 h-full flex items-center justify-center paper-texture">
                  <div className="max-w-md mx-auto w-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <TeacherIcon className="mr-2" />
                        <span className="font-bold text-lg">AvaliAI</span>
                      </div>
                      <div className="text-sm font-medium text-muted-foreground">Fundado em 2023</div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        O AvaliAI nasceu da experiência de professores que enfrentavam o desafio de corrigir centenas de
                        redações manualmente. Nosso objetivo é utilizar a inteligência artificial para tornar o processo
                        de avaliação mais eficiente e consistente.
                      </p>
                      <p className="text-muted-foreground">
                        Nossa equipe é composta por educadores, desenvolvedores e especialistas em IA que trabalham
                        juntos para criar uma ferramenta que realmente entende as necessidades dos professores e
                        instituições de ensino.
                      </p>
                      <div className="pt-4 flex justify-between items-center border-t mt-4">
                        <div className="text-sm text-muted-foreground">Nossa Visão</div>
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">Educação para Todos</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-12 md:py-24 bg-blue-50 dark:bg-slate-900/50">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <HandwrittenText color="blue" className="text-3xl">
              Nossos Valores
            </HandwrittenText>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Princípios que Guiam Nosso Trabalho</h2>
            <p className="text-muted-foreground md:text-lg max-w-[700px] mx-auto">
              Princípios que guiam nosso trabalho e nossa missão de transformar a educação.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card-teacher p-6 space-y-4 group hover:-translate-y-1 transition-transform">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full w-fit group-hover:animate-wiggle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold">Inovação</h3>
              <p className="text-muted-foreground">
                Buscamos constantemente novas formas de aplicar a tecnologia para resolver desafios educacionais.
              </p>
              <div className="pt-2">
                <HandwrittenText color="blue" className="text-lg">
                  Sempre inovando!
                </HandwrittenText>
              </div>
            </div>
            <div className="card-teacher p-6 space-y-4 group hover:-translate-y-1 transition-transform">
              <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full w-fit group-hover:animate-wiggle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-purple-600 dark:text-purple-400"
                >
                  <path d="M18 6 7 17l-5-5"></path>
                  <path d="m22 10-7.5 7.5L13 16"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold">Qualidade</h3>
              <p className="text-muted-foreground">
                Comprometemo-nos com a excelência em tudo o que fazemos, desde o desenvolvimento até o suporte.
              </p>
              <div className="pt-2">
                <HandwrittenText color="purple" className="text-lg">
                  Excelência sempre!
                </HandwrittenText>
              </div>
            </div>
            <div className="card-teacher p-6 space-y-4 group hover:-translate-y-1 transition-transform">
              <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full w-fit group-hover:animate-wiggle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-green-600 dark:text-green-400"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold">Acessibilidade</h3>
              <p className="text-muted-foreground">
                Acreditamos que tecnologias educacionais avançadas devem ser acessíveis a todos.
              </p>
              <div className="pt-2">
                <HandwrittenText color="green" className="text-lg">
                  Para todos!
                </HandwrittenText>
              </div>
            </div>
            <div className="card-teacher p-6 space-y-4 group hover:-translate-y-1 transition-transform">
              <div className="bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-full w-fit group-hover:animate-wiggle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-yellow-600 dark:text-yellow-400"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold">Transparência</h3>
              <p className="text-muted-foreground">
                Mantemos comunicação clara e honesta com nossos usuários e parceiros.
              </p>
              <div className="pt-2">
                <HandwrittenText color="yellow" className="text-lg">
                  Sempre claros!
                </HandwrittenText>
              </div>
            </div>
            <div className="card-teacher p-6 space-y-4 group hover:-translate-y-1 transition-transform">
              <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-full w-fit group-hover:animate-wiggle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-red-600 dark:text-red-400"
                >
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold">Impacto Social</h3>
              <p className="text-muted-foreground">
                Trabalhamos para criar um impacto positivo na educação e na sociedade como um todo.
              </p>
              <div className="pt-2">
                <HandwrittenText color="red" className="text-lg">
                  Transformando vidas!
                </HandwrittenText>
              </div>
            </div>
            <div className="card-teacher p-6 space-y-4 group hover:-translate-y-1 transition-transform">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full w-fit group-hover:animate-wiggle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                >
                  <path d="M17 6.1H3"></path>
                  <path d="M21 12.1H3"></path>
                  <path d="M15.1 18H3"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold">Colaboração</h3>
              <p className="text-muted-foreground">
                Valorizamos parcerias e feedback para melhorar continuamente nossos produtos.
              </p>
              <div className="pt-2">
                <HandwrittenText color="blue" className="text-lg">
                  Juntos somos mais!
                </HandwrittenText>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <HandwrittenText color="purple" className="text-3xl">
              Quem Somos
            </HandwrittenText>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Nossa Equipe</h2>
            <p className="text-muted-foreground md:text-lg max-w-[700px] mx-auto">
              Conheça as pessoas por trás do AvaliAI que trabalham para transformar a educação.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3 max-w-3xl mx-auto">
            <div className="card-teacher p-6 text-center space-y-4 group hover:-translate-y-1 transition-transform">
              <div className="mx-auto rounded-full bg-blue-100 dark:bg-blue-900/50 h-24 w-24 flex items-center justify-center group-hover:animate-wiggle">
                <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">BA</span>
              </div>
              <div>
                <h4 className="font-bold text-lg">Bruno Aguiar</h4>
                <p className="text-sm text-muted-foreground">Desenvolvedor</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Especialista em desenvolvimento web e inteligência artificial.
              </p>
              <div className="pt-2">
                <HandwrittenText color="blue" className="text-sm">
                  "Tecnologia para educar!"
                </HandwrittenText>
              </div>
            </div>
            <div className="card-teacher p-6 text-center space-y-4 group hover:-translate-y-1 transition-transform">
              <div className="mx-auto rounded-full bg-purple-100 dark:bg-purple-900/50 h-24 w-24 flex items-center justify-center group-hover:animate-wiggle">
                <span className="font-bold text-2xl text-purple-600 dark:text-purple-400">IL</span>
              </div>
              <div>
                <h4 className="font-bold text-lg">Izabely Luizy</h4>
                <p className="text-sm text-muted-foreground">Designer UX/UI</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Especialista em experiência do usuário e design de interfaces.
              </p>
              <div className="pt-2">
                <HandwrittenText color="purple" className="text-sm">
                  "Design que inspira!"
                </HandwrittenText>
              </div>
            </div>
            <div className="card-teacher p-6 text-center space-y-4 group hover:-translate-y-1 transition-transform">
              <div className="mx-auto rounded-full bg-green-100 dark:bg-green-900/50 h-24 w-24 flex items-center justify-center group-hover:animate-wiggle">
                <span className="font-bold text-2xl text-green-600 dark:text-green-400">CR</span>
              </div>
              <div>
                <h4 className="font-bold text-lg">Caio Reis</h4>
                <p className="text-sm text-muted-foreground">Especialista em IA</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Doutor em Inteligência Artificial com foco em processamento de linguagem natural.
              </p>
              <div className="pt-2">
                <HandwrittenText color="green" className="text-sm">
                  "IA para o bem!"
                </HandwrittenText>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <HandwrittenText className="text-3xl text-yellow-200">Junte-se a nós!</HandwrittenText>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Faça Parte da Revolução Educacional</h2>
              <p className="md:text-xl">
                Junte-se a milhares de educadores que já estão economizando tempo e melhorando a qualidade de suas
                avaliações com nossa plataforma 100% gratuita.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" variant="secondary" className="rounded-full" asChild>
                  <Link href="/register">Criar Conta Gratuita</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent rounded-full border-white text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/contact">Falar com Nossa Equipe</Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto lg:mx-0 relative">
              <NotebookCard className="transform rotate-3" darkMode>
                <h3 className="text-xl font-bold mb-4 text-blue-300">Por que nos escolher:</h3>
                <ul className="space-y-2 text-white">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <span>Plataforma 100% gratuita</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <span>Tecnologia de ponta em IA</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <span>Desenvolvido por educadores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <span>Suporte técnico especializado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <span>Atualizações constantes</span>
                  </li>
                </ul>
                <div className="mt-4 text-right">
                  <HandwrittenText color="red" className="text-xl">
                    Educação transformada!
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
