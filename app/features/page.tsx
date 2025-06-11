"use client"

import { WebsiteLayout } from "@/components/website-layout"
import { Button } from "@/components/ui/button"
import { PenTool, CheckCircle, BarChart, FileText, Camera, Shield, ArrowRight } from "lucide-react"
import Link from "next/link"
import { HandwrittenText } from "@/components/handwritten-text"
import { NotebookCard } from "@/components/notebook-card"
import { TeacherIcon } from "@/components/teacher-icon"

export default function FeaturesPage() {
  return (
    <WebsiteLayout>
      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-yellow-50 to-white dark:from-slate-900 dark:to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-yellow-100 dark:bg-yellow-900/50 px-3 py-1 text-sm text-yellow-600 dark:text-yellow-300 rotate-1">
                <HandwrittenText>Tecnologia de ponta</HandwrittenText>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl relative">
                <span className="highlight-marker">Recursos do AvaliAI</span>
                <div className="absolute -top-6 -right-6 text-yellow-400 transform rotate-12 hidden md:block">
                  <HandwrittenText className="text-2xl">Incrível!</HandwrittenText>
                </div>
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Descubra como nossa plataforma gratuita pode transformar o processo de avaliação de redações.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="btn-teacher group" asChild>
                  <Link href="/register">
                    Começar Agora
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full" asChild>
                  <Link href="/contact">Falar com Nossa Equipe</Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto lg:mx-0 relative">
              <div className="relative h-[350px] w-full sm:h-[400px] lg:h-[500px]">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg opacity-10 blur-xl"></div>
                <NotebookCard className="absolute top-4 left-4 w-64 h-64 transform -rotate-6 animate-float" highlight>
                  <HandwrittenText color="green" className="text-2xl">
                    Recursos Incríveis!
                  </HandwrittenText>
                  <p className="mt-2">Tecnologia avançada para facilitar seu trabalho de correção de redações.</p>
                  <div className="mt-4 flex justify-end">
                    <HandwrittenText color="yellow">Experimente hoje!</HandwrittenText>
                  </div>
                </NotebookCard>

                <div className="relative bg-white dark:bg-slate-800 rounded-lg border shadow-lg p-6 h-full flex items-center justify-center paper-texture">
                  <div className="max-w-md mx-auto w-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <TeacherIcon className="mr-2" />
                        <span className="font-bold text-lg">AvaliAI</span>
                      </div>
                      <div className="text-sm font-medium text-muted-foreground">Recursos</div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-yellow-100 dark:bg-yellow-900/50 p-2 rounded-full">
                          <PenTool className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">Correção Automática</h3>
                          <p className="text-sm text-muted-foreground">Avaliação baseada nas 5 competências do ENEM</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-full">
                          <Camera className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">Digitalização de Redações</h3>
                          <p className="text-sm text-muted-foreground">Reconhecimento de texto manuscrito</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full">
                          <BarChart className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">Análise de Desempenho</h3>
                          <p className="text-sm text-muted-foreground">Gráficos e estatísticas detalhadas</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-full">
                          <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">Exportação de Relatórios</h3>
                          <p className="text-sm text-muted-foreground">Relatórios em PDF de alta qualidade</p>
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

      {/* Main Features Section */}
      <section className="py-12 md:py-24 bg-yellow-50 dark:bg-slate-900/50">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <HandwrittenText color="yellow" className="text-3xl">
              Recursos Principais
            </HandwrittenText>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Como o AvaliAI Funciona</h2>
            <p className="text-muted-foreground md:text-lg max-w-[700px] mx-auto">
              Conheça em detalhes os recursos que tornam o AvaliAI a escolha perfeita para professores.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              <div className="card-teacher p-6 space-y-4">
                <div className="bg-primary/10 p-3 rounded-full w-fit">
                  <PenTool className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Correção Automática</h2>
                <p className="text-muted-foreground">
                  Nossa tecnologia de IA analisa redações seguindo os critérios do ENEM, avaliando cada competência com
                  precisão e consistência. O sistema identifica pontos fortes e áreas de melhoria, fornecendo uma
                  avaliação completa em segundos.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <span>Avaliação baseada nas 5 competências do ENEM</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <span>Análise de coesão, coerência e adequação à norma culta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <span>Pontuação detalhada por competência</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <HandwrittenText color="yellow" className="text-lg">
                    Economize tempo!
                  </HandwrittenText>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <HandwrittenText color="purple" className="text-3xl">
              Mais Recursos
            </HandwrittenText>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Tudo o que Você Precisa</h2>
            <p className="text-muted-foreground md:text-lg max-w-[700px] mx-auto">
              Explore todos os recursos que o AvaliAI oferece para facilitar seu trabalho.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            <div className="card-teacher p-6 space-y-4 group hover:-translate-y-1 transition-transform">
              <div className="bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-full w-fit group-hover:animate-wiggle">
                <Camera className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold">Digitalização de Redações</h3>
              <p className="text-muted-foreground">
                Capture redações manuscritas com a câmera do seu dispositivo. Nossa tecnologia OCR converte
                automaticamente a escrita à mão em texto digital para análise.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <span>Reconhecimento de texto manuscrito</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <span>Processamento rápido e preciso</span>
                </li>
              </ul>
              <div className="pt-2">
                <HandwrittenText color="yellow" className="text-lg">
                  Chega de digitar!
                </HandwrittenText>
              </div>
            </div>
            <div className="card-teacher p-6 space-y-4 group hover:-translate-y-1 transition-transform">
              <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full w-fit group-hover:animate-wiggle">
                <BarChart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold">Análise de Desempenho</h3>
              <p className="text-muted-foreground">
                Acompanhe o progresso dos alunos ao longo do tempo com gráficos e estatísticas detalhadas. Identifique
                tendências e áreas que precisam de mais atenção.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                  <span>Gráficos de evolução por competência</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                  <span>Comparação com médias da turma</span>
                </li>
              </ul>
              <div className="pt-2">
                <HandwrittenText color="purple" className="text-lg">
                  Visualize o progresso!
                </HandwrittenText>
              </div>
            </div>
            <div className="card-teacher p-6 space-y-4 group hover:-translate-y-1 transition-transform">
              <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full w-fit group-hover:animate-wiggle">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold">Exportação de Relatórios</h3>
              <p className="text-muted-foreground">
                Gere relatórios detalhados em PDF para compartilhar com alunos, pais ou guardar em seus registros. Os
                relatórios incluem a avaliação completa e sugestões de melhoria.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <span>Relatórios individuais por aluno</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <span>Exportação em PDF de alta qualidade</span>
                </li>
              </ul>
              <div className="pt-2">
                <HandwrittenText color="green" className="text-lg">
                  Compartilhe facilmente!
                </HandwrittenText>
              </div>
            </div>
            <div className="card-teacher p-6 space-y-4 group hover:-translate-y-1 transition-transform col-span-1 sm:col-span-2 lg:col-span-1 mx-auto lg:mx-0 lg:col-start-2">
              <div className="bg-amber-100 dark:bg-amber-900/50 p-3 rounded-full w-fit group-hover:animate-wiggle">
                <Shield className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold">Segurança e Privacidade</h3>
              <p className="text-muted-foreground">
                Seus dados são protegidos com criptografia de ponta a ponta e armazenamento seguro. Cumprimos com todas
                as regulamentações de proteção de dados.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <span>Criptografia de dados</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <span>Conformidade com LGPD</span>
                </li>
              </ul>
              <div className="pt-2">
                <HandwrittenText color="amber" className="text-lg">
                  100% seguro!
                </HandwrittenText>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24 bg-gradient-to-r from-yellow-600 to-amber-600 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <HandwrittenText className="text-3xl text-yellow-200">Vamos começar?</HandwrittenText>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Pronto para Experimentar?</h2>
              <p className="md:text-xl">
                Comece a usar o AvaliAI hoje mesmo e transforme sua forma de avaliar redações. É 100% gratuito!
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
                <h3 className="text-xl font-bold mb-4 text-yellow-300">Comece em 3 passos:</h3>
                <ul className="space-y-4 text-white">
                  <li className="flex items-start gap-3">
                    <div className="bg-yellow-800 rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Crie sua conta gratuita</p>
                      <p className="text-sm text-yellow-200">Leva apenas alguns segundos</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-yellow-800 rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Escaneie uma redação</p>
                      <p className="text-sm text-yellow-200">Use a câmera do seu dispositivo</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-yellow-800 rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Receba a análise completa</p>
                      <p className="text-sm text-yellow-200">Em segundos, com feedback detalhado</p>
                    </div>
                  </li>
                </ul>
                <div className="mt-4 text-right">
                  <HandwrittenText color="red" className="text-xl">
                    É simples assim!
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
