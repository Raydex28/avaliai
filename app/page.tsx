"use client"

import { Button } from "@/components/ui/button"
import { WebsiteLayout } from "@/components/website-layout"
import { CheckCircle, ArrowRight, BookOpen, Users, Award } from "lucide-react"
import Link from "next/link"
import { TeacherIcon } from "@/components/teacher-icon"
import { NotebookCard } from "@/components/notebook-card"
import { HandwrittenText } from "@/components/handwritten-text"

export default function HomePage() {
  return (
    <WebsiteLayout>
      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-yellow-50 to-white dark:from-slate-900 dark:to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-yellow-100 dark:bg-yellow-900/50 px-3 py-1 text-sm text-yellow-600 dark:text-yellow-300 rotate-1">
                <HandwrittenText size="lg">Novo: Análise de Competências ENEM</HandwrittenText>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl relative text-foreground">
                <span className="highlight-marker">Avaliação de Redações</span> com Inteligência Artificial
                <div className="absolute -top-6 -right-6 text-yellow-400 transform rotate-12 hidden md:block">
                  <HandwrittenText size="xl">Fácil e rápido!</HandwrittenText>
                </div>
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Corrija redações de forma rápida, precisa e com feedback detalhado. Economize tempo e ofereça avaliações
                consistentes para seus alunos.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="btn-teacher group" asChild>
                  <Link href="/register">
                    Começar Agora
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full" asChild>
                  <Link href="/features">Conhecer Recursos</Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto lg:mx-0 relative">
              <div className="relative h-[350px] w-full sm:h-[400px] lg:h-[500px]">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-lg opacity-10 blur-xl"></div>
                <NotebookCard className="absolute top-4 left-4 w-64 h-64 transform -rotate-6 animate-float" highlight>
                  <HandwrittenText color="red" size="xl">
                    Nota: 920/1000
                  </HandwrittenText>
                  <p className="mt-2">Excelente trabalho! Sua argumentação está muito bem estruturada.</p>
                  <div className="mt-4 flex justify-end">
                    <HandwrittenText color="yellow" size="lg">
                      Prof. Carlos
                    </HandwrittenText>
                  </div>
                </NotebookCard>

                <div className="relative bg-white dark:bg-slate-800 rounded-lg border shadow-lg p-6 h-full flex items-center justify-center paper-texture">
                  <div className="max-w-md mx-auto w-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <TeacherIcon className="mr-2" />
                        <span className="font-bold text-lg">AvaliAI</span>
                      </div>
                      <div className="text-sm font-medium text-muted-foreground">Redação #1234</div>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-sm">Competência 1 - Norma Culta</h3>
                          <div className="flex items-center">
                            <span className="font-bold">180</span>
                            <span className="text-muted-foreground text-sm ml-1">/200</span>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="h-2 rounded-full bg-yellow-500" style={{ width: "90%" }}></div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-sm">Competência 2 - Tema/Texto</h3>
                          <div className="flex items-center">
                            <span className="font-bold">160</span>
                            <span className="text-muted-foreground text-sm ml-1">/200</span>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="h-2 rounded-full bg-yellow-500" style={{ width: "80%" }}></div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-sm">Competência 3 - Argumentação</h3>
                          <div className="flex items-center">
                            <span className="font-bold">200</span>
                            <span className="text-muted-foreground text-sm ml-1">/200</span>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="h-2 rounded-full bg-yellow-500" style={{ width: "100%" }}></div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-sm">Competência 4 - Coesão</h3>
                          <div className="flex items-center">
                            <span className="font-bold">180</span>
                            <span className="text-muted-foreground text-sm ml-1">/200</span>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="h-2 rounded-full bg-yellow-500" style={{ width: "90%" }}></div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-sm">Competência 5 - Proposta</h3>
                          <div className="flex items-center">
                            <span className="font-bold">200</span>
                            <span className="text-muted-foreground text-sm ml-1">/200</span>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="h-2 rounded-full bg-yellow-500" style={{ width: "100%" }}></div>
                        </div>
                      </div>
                      <div className="pt-4 flex justify-between items-center border-t mt-4">
                        <div className="text-sm text-muted-foreground">Nota Final</div>
                        <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">920</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 transform rotate-12">
                  <img
                    src="/images/pencil-doodle.png"
                    alt="Lápis"
                    className="w-24 h-24 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-24 bg-yellow-50 dark:bg-slate-900/50">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <HandwrittenText color="yellow" size="2xl">
              Recursos Incríveis
            </HandwrittenText>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-foreground">
              Como o AvaliAI Ajuda Professores
            </h2>
            <p className="text-muted-foreground md:text-lg max-w-[700px] mx-auto">
              Nossa plataforma gratuita oferece ferramentas avançadas para avaliação de redações, economizando seu tempo
              e melhorando a qualidade do feedback.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card-teacher p-6 space-y-4 group hover:-translate-y-1 transition-transform">
              <div className="bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-full w-fit group-hover:animate-wiggle">
                <BookOpen className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold">Correção Automática</h3>
              <p className="text-muted-foreground">
                Avalie redações em segundos com nossa tecnologia de IA que segue os critérios do ENEM.
              </p>
              <div className="pt-2">
                <HandwrittenText color="green" size="lg">
                  Economize até 70% do seu tempo!
                </HandwrittenText>
              </div>
            </div>
            <div className="card-teacher p-6 space-y-4 group hover:-translate-y-1 transition-transform">
              <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full w-fit group-hover:animate-wiggle">
                <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold">Feedback Detalhado</h3>
              <p className="text-muted-foreground">
                Forneça comentários específicos sobre cada competência e sugestões de melhoria.
              </p>
              <div className="pt-2">
                <HandwrittenText color="purple" size="lg">
                  Feedback personalizado!
                </HandwrittenText>
              </div>
            </div>
            <div className="card-teacher p-6 space-y-4 group hover:-translate-y-1 transition-transform">
              <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full w-fit group-hover:animate-wiggle">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold">Análise de Desempenho</h3>
              <p className="text-muted-foreground">
                Acompanhe o progresso dos alunos com gráficos e estatísticas detalhadas.
              </p>
              <div className="pt-2">
                <HandwrittenText color="green" size="lg">
                  Visualize o progresso!
                </HandwrittenText>
              </div>
            </div>
            <div className="card-teacher p-6 space-y-4 group hover:-translate-y-1 transition-transform">
              <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-full w-fit group-hover:animate-wiggle">
                <Award className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold">Exportação de Relatórios</h3>
              <p className="text-muted-foreground">
                Exporte avaliações em PDF para compartilhar com alunos ou guardar em seus registros.
              </p>
              <div className="pt-2">
                <HandwrittenText color="red" size="lg">
                  Compartilhe facilmente!
                </HandwrittenText>
              </div>
            </div>
            <div className="card-teacher p-6 space-y-4 group hover:-translate-y-1 transition-transform">
              <div className="bg-amber-100 dark:bg-amber-900/50 p-3 rounded-full w-fit group-hover:animate-wiggle">
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
                  className="h-6 w-6 text-amber-600 dark:text-amber-400"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M12 18v-6" />
                  <path d="m9 15 3 3 3-3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Digitalização de Redações</h3>
              <p className="text-muted-foreground">
                Capture redações manuscritas com a câmera e converta automaticamente para texto.
              </p>
              <div className="pt-2">
                <HandwrittenText color="amber" size="lg">
                  Chega de digitar!
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
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Segurança de Dados</h3>
              <p className="text-muted-foreground">
                Seus dados são protegidos com criptografia de ponta a ponta e armazenamento seguro.
              </p>
              <div className="pt-2">
                <HandwrittenText color="yellow" size="lg">
                  100% seguro!
                </HandwrittenText>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24 bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <HandwrittenText size="2xl" className="text-yellow-100">
                Vamos começar?
              </HandwrittenText>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Pronto para Transformar suas Avaliações?
              </h2>
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
                <h3 className="text-xl font-bold mb-4 text-yellow-300">Lista de Benefícios:</h3>
                <ul className="space-y-2 text-white">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <span>Avaliação de redações em segundos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <span>Feedback detalhado por competência</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <span>Digitalização de redações manuscritas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <span>Relatórios e estatísticas de desempenho</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <span>Suporte técnico especializado</span>
                  </li>
                </ul>
                <div className="mt-4 text-right">
                  <HandwrittenText color="red" size="xl">
                    E o melhor: 100% gratuito!
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
