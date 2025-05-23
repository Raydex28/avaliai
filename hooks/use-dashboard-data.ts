"use client"

import { useState, useEffect } from "react"
import { getAssessments } from "@/services/assessment-service"
import type { Assessment } from "@/types/assessment"

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

export function useDashboardData(): DashboardData {
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
        const assessments = await getAssessments()

        // Calcular estatísticas básicas
        const totalAssessments = assessments.length
        const averageGrade =
          totalAssessments > 0 ? Math.round(assessments.reduce((sum, a) => sum + a.grade, 0) / totalAssessments) : 0

        // Obter lista única de alunos
        const uniqueStudents = new Set(assessments.map((a) => a.studentName))
        const totalStudents = uniqueStudents.size

        // Ordenar por data (mais recentes primeiro)
        const sortedAssessments = [...assessments].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )

        // Pegar as 5 avaliações mais recentes
        const recentAssessments = sortedAssessments.slice(0, 5)

        // Preparar dados para o gráfico de desempenho
        // Agrupar por data e calcular média
        const assessmentsByDate = assessments.reduce(
          (acc, assessment) => {
            const date = new Date(assessment.createdAt).toLocaleDateString("pt-BR")
            if (!acc[date]) {
              acc[date] = { total: 0, count: 0 }
            }
            acc[date].total += assessment.grade
            acc[date].count += 1
            return acc
          },
          {} as Record<string, { total: number; count: number }>,
        )

        // Converter para formato de gráfico
        const dates = Object.keys(assessmentsByDate)
          .sort((a, b) => {
            const dateA = new Date(a.split("/").reverse().join("-"))
            const dateB = new Date(b.split("/").reverse().join("-"))
            return dateA.getTime() - dateB.getTime()
          })
          .slice(-7) // Últimos 7 dias com dados

        const averages = dates.map((date) => Math.round(assessmentsByDate[date].total / assessmentsByDate[date].count))

        // Preparar dados para o gráfico de competências
        // Calcular média por competência
        const competencyAverages =
          assessments.length > 0
            ? assessments.reduce(
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
            labels: dates,
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
  }, [])

  return data
}
