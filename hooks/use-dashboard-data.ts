"use client"

import { useState, useEffect } from "react"
import { getAssessments } from "@/services/assessment-service"
import { useClass } from "@/contexts/class-context"
import type { Assessment } from "@/types/assessment"
import type { TimeFrame } from "@/types/class"

interface DashboardData {
  totalAssessments: number
  averageGrade: number
  totalStudents: number
  recentAssessments: Assessment[]
  performanceData: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
    }[]
  }
  competencyData: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor: string[]
      borderColor: string[]
      borderWidth: number
    }[]
  }
  isLoading: boolean
  error: string | null
}

// Função auxiliar para filtrar avaliações por período
function filterAssessmentsByTimeFrame(assessments: Assessment[], timeFrame: TimeFrame): Assessment[] {
  const now = new Date()
  const currentYear = now.getFullYear()

  // Definir datas de início e fim com base no período selecionado
  let startDate: Date, endDate: Date

  switch (timeFrame) {
    case "1º Bimestre":
      startDate = new Date(currentYear, 0, 1) // 1º de janeiro
      endDate = new Date(currentYear, 2, 31) // 31 de março
      break
    case "2º Bimestre":
      startDate = new Date(currentYear, 3, 1) // 1º de abril
      endDate = new Date(currentYear, 5, 30) // 30 de junho
      break
    case "3º Bimestre":
      startDate = new Date(currentYear, 6, 1) // 1º de julho
      endDate = new Date(currentYear, 8, 30) // 30 de setembro
      break
    case "4º Bimestre":
      startDate = new Date(currentYear, 9, 1) // 1º de outubro
      endDate = new Date(currentYear, 11, 31) // 31 de dezembro
      break
    case "1º Semestre":
      startDate = new Date(currentYear, 0, 1) // 1º de janeiro
      endDate = new Date(currentYear, 5, 30) // 30 de junho
      break
    case "2º Semestre":
      startDate = new Date(currentYear, 6, 1) // 1º de julho
      endDate = new Date(currentYear, 11, 31) // 31 de dezembro
      break
  }

  // Filtrar avaliações dentro do período
  return assessments.filter((assessment) => {
    const assessmentDate = new Date(assessment.createdAt)
    return assessmentDate >= startDate && assessmentDate <= endDate
  })
}

// Função para agrupar avaliações por mês ou bimestre
function groupAssessmentsByPeriod(assessments: Assessment[], timeFrame: TimeFrame): Record<string, Assessment[]> {
  const isBimestral = timeFrame.includes("Bimestre")
  const grouped: Record<string, Assessment[]> = {}

  assessments.forEach((assessment) => {
    const date = new Date(assessment.createdAt)
    let key: string

    if (isBimestral) {
      // Para bimestres, agrupar por semana
      const weekNumber = Math.ceil(date.getDate() / 7)
      key = `Semana ${weekNumber}`
    } else {
      // Para semestres, agrupar por mês
      const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
      key = monthNames[date.getMonth()]
    }

    if (!grouped[key]) {
      grouped[key] = []
    }

    grouped[key].push(assessment)
  })

  return grouped
}

export function useDashboardData(): DashboardData {
  const { currentClass, selectedTimeFrame } = useClass()
  const [data, setData] = useState<DashboardData>({
    totalAssessments: 0,
    averageGrade: 0,
    totalStudents: 0,
    recentAssessments: [],
    performanceData: {
      labels: [],
      datasets: [],
    },
    competencyData: {
      labels: [],
      datasets: [],
    },
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData((prev) => ({ ...prev, isLoading: true }))

        // Buscar todas as avaliações
        const assessments = await getAssessments()

        // Filtrar por período selecionado
        const filteredAssessments = filterAssessmentsByTimeFrame(assessments, selectedTimeFrame)

        // Calcular estatísticas básicas
        const totalAssessments = filteredAssessments.length
        const averageGrade =
          totalAssessments > 0
            ? Math.round(filteredAssessments.reduce((sum, a) => sum + a.grade, 0) / totalAssessments)
            : 0

        // Obter lista única de alunos
        const uniqueStudents = new Set(filteredAssessments.map((a) => a.studentName))
        const totalStudents = uniqueStudents.size

        // Ordenar por data (mais recentes primeiro)
        const sortedAssessments = [...filteredAssessments].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )

        // Pegar as 5 avaliações mais recentes
        const recentAssessments = sortedAssessments.slice(0, 5)

        // Agrupar avaliações por período (mês ou semana)
        const groupedAssessments = groupAssessmentsByPeriod(filteredAssessments, selectedTimeFrame)

        // Preparar dados para o gráfico de desempenho
        const periods = Object.keys(groupedAssessments).sort()
        const averages = periods.map((period) => {
          const periodAssessments = groupedAssessments[period]
          return periodAssessments.length > 0
            ? Math.round(periodAssessments.reduce((sum, a) => sum + a.grade, 0) / periodAssessments.length)
            : 0
        })

        // Preparar dados para o gráfico de competências
        // Calcular média por competência
        const competencyAverages =
          filteredAssessments.length > 0
            ? filteredAssessments.reduce(
                (acc, assessment) => {
                  assessment.criteriaScores.forEach((score) => {
                    if (!acc[score.name]) {
                      acc[score.name] = { total: 0, count: 0 }
                    }
                    acc[score.name].total += score.score
                    acc[score.name].count += 1
                  })
                  return acc
                },
                {} as Record<string, { total: number; count: number }>,
              )
            : {}

        const competencyLabels = Object.keys(competencyAverages)
        const competencyValues = competencyLabels.map((label) =>
          Math.round(competencyAverages[label].total / competencyAverages[label].count),
        )

        setData({
          totalAssessments,
          averageGrade,
          totalStudents,
          recentAssessments,
          performanceData: {
            labels: periods,
            datasets: [
              {
                label: "Média de Notas",
                data: averages,
                borderColor: "rgb(59, 130, 246)",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
              },
            ],
          },
          competencyData: {
            labels: competencyLabels.map((label) => label.replace("Competência ", "C").split(" - ")[0]),
            datasets: [
              {
                label: "Média por Competência",
                data: competencyValues,
                backgroundColor: ["rgba(59, 130, 246, 0.2)"],
                borderColor: ["rgb(59, 130, 246)"],
                borderWidth: 2,
              },
            ],
          },
          isLoading: false,
          error: null,
        })
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error)
        setData((prev) => ({
          ...prev,
          isLoading: false,
          error: "Falha ao carregar dados do dashboard",
        }))
      }
    }

    fetchData()
  }, [currentClass, selectedTimeFrame])

  return data
}
