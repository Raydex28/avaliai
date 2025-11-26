"use client"

import { useRouter } from "next/navigation"
import { Loader2, FileText, BarChart, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { StatsCard } from "@/components/dashboard/stats-card"
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { CompetencyChart } from "@/components/dashboard/competency-chart"
import { RecentAssessments } from "@/components/dashboard/recent-assessments"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ClassSelector } from "@/components/class-selector"
import { TimeFrameSelector } from "@/components/time-frame-selector"
import { useClass } from "@/contexts/class-context"

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { currentClass } = useClass()
  const {
    totalAssessments,
    averageGrade,
    totalStudents,
    recentAssessments,
    performanceData,
    competencyData,
    isLoading,
    error,
  } = useDashboardData()

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-8 sm:py-12">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-muted-foreground">Carregando dados do dashboard...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <Alert variant="destructive" className="mb-4 sm:mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center">
          <BarChart className="h-5 w-5 text-primary mr-2" />
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <ClassSelector />
          <TimeFrameSelector />
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatsCard
          title="Redações Avaliadas"
          value={totalAssessments}
          icon={<FileText className="h-4 w-4 sm:h-5 sm:w-5" />}
          description={`Total de redações ${currentClass ? `da turma ${currentClass.name}` : ""}`}
        />
        <StatsCard
          title="Média das Notas"
          value={averageGrade}
          icon={<BarChart className="h-4 w-4 sm:h-5 sm:w-5" />}
          description="Pontuação média (0-1000)"
        />
        <StatsCard
          title="Alunos Avaliados"
          value={totalStudents}
          icon={<User className="h-4 w-4 sm:h-5 sm:w-5" />}
          description="Número de alunos únicos"
        />
      </div>

      {/* Gráficos e tabelas */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <PerformanceChart
          title="Desempenho ao Longo do Tempo"
          description={`Média das notas por período (${currentClass?.period === "Bimestre" ? "semanas" : "meses"})`}
          data={performanceData}
        />
        <CompetencyChart
          title="Desempenho por Competência"
          description="Média por competência do ENEM"
          data={competencyData}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <RecentAssessments assessments={recentAssessments} />
      </div>
    </DashboardLayout>
  )
}
