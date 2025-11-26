"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Download, FileText, TrendingUp, Plus } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PDFDownloadLink } from "@/components/pdf-download-link"
import { useAuth } from "@/contexts/auth-context"
import type { Assessment } from "@/types/assessment"

export default function ResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isViewMode, setIsViewMode] = useState(false)

  const hasProcessed = useRef(false)

  const assessmentId = searchParams.get("id")
  const text = searchParams.get("text")
  const studentName = searchParams.get("student")
  const subject = searchParams.get("subject")
  const classId = searchParams.get("classId")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (hasProcessed.current) {
      return
    }

    hasProcessed.current = true

    if (assessmentId) {
      setIsViewMode(true)
      loadAssessment(assessmentId)
    } else if (text && studentName) {
      setIsViewMode(false)
      processAnalysis()
    } else {
      setError("Parâmetros insuficientes para processar a avaliação.")
      setIsLoading(false)
    }
  }, [user, assessmentId, text, studentName])

  const loadAssessment = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("[v0] Carregando avaliação do histórico:", id)

      const response = await fetch(`/api/assessments/${id}`)

      if (!response.ok) {
        throw new Error("Avaliação não encontrada")
      }

      const data = await response.json()
      console.log("[v0] Avaliação carregada:", data)
      setAssessment(data)
    } catch (error) {
      console.error("[v0] Erro ao carregar avaliação:", error)
      setError("Não foi possível carregar a avaliação. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const processAnalysis = async () => {
    if (!text || !studentName) return

    setIsLoading(true)
    setError(null)

    try {
      console.log("[v0] Iniciando análise via API...")

      const response = await fetch("/api/analyze-essay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          essayText: text,
          essayTitle: studentName,
          className: classId || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao analisar redação")
      }

      const result = await response.json()

      console.log("[v0] Análise concluída com sucesso")

      const newAssessment: Assessment = {
        id: result.essayId,
        studentName: studentName,
        subject: subject || "Redação",
        text: text,
        criteria: [],
        grade: result.analysis.notaTotal,
        feedback: {
          strengths: [result.analysis.feedbackGeral],
          improvements: [],
        },
        criteriaScores: [
          { name: "Competência 1", score: result.analysis.competencia1.nota, weight: 0.2 },
          { name: "Competência 2", score: result.analysis.competencia2.nota, weight: 0.2 },
          { name: "Competência 3", score: result.analysis.competencia3.nota, weight: 0.2 },
          { name: "Competência 4", score: result.analysis.competencia4.nota, weight: 0.2 },
          { name: "Competência 5", score: result.analysis.competencia5.nota, weight: 0.2 },
        ],
        createdAt: new Date().toISOString(),
        classId: classId || "",
      }

      setAssessment(newAssessment)

      setTimeout(() => {
        router.push("/history")
      }, 2000)
    } catch (error) {
      console.error("[v0] Erro ao processar análise:", error)
      setError(error instanceof Error ? error.message : "Erro ao processar a análise da redação.")
    } finally {
      setIsLoading(false)
    }
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 900) return "text-green-600"
    if (grade >= 700) return "text-yellow-600"
    if (grade >= 500) return "text-orange-600"
    return "text-red-600"
  }

  const getGradeBadgeVariant = (grade: number) => {
    if (grade >= 900) return "default"
    if (grade >= 700) return "secondary"
    if (grade >= 500) return "outline"
    return "destructive"
  }

  const handleNewAnalysis = () => {
    router.push("/scan")
  }

  if (!user) {
    return null
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{isViewMode ? "Carregando avaliação..." : "Analisando redação..."}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <p className="text-red-600 mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => router.push("/dashboard")}>Voltar ao Dashboard</Button>
              <Button onClick={() => router.push("/scan")} variant="outline">
                Nova Análise
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!assessment) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Nenhuma avaliação encontrada.</p>
            <Button onClick={() => router.push("/dashboard")}>Voltar ao Dashboard</Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Resultado da Análise</h1>
              <p className="text-muted-foreground">
                {assessment.studentName} - {assessment.subject}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PDFDownloadLink assessment={assessment}>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Baixar PDF
              </Button>
            </PDFDownloadLink>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Grade Overview */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">Nota Final</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className={`text-4xl font-bold mb-2 ${getGradeColor(assessment.grade)}`}>{assessment.grade}</div>
              <Badge variant={getGradeBadgeVariant(assessment.grade)} className="mb-4">
                {assessment.grade >= 900
                  ? "Excelente"
                  : assessment.grade >= 700
                    ? "Bom"
                    : assessment.grade >= 500
                      ? "Regular"
                      : "Insuficiente"}
              </Badge>
              <div className="text-sm text-muted-foreground">Pontuação máxima: 1000</div>
            </CardContent>
          </Card>

          {/* Criteria Scores */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Pontuação por Competência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assessment.criteriaScores.map((criteria, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{criteria.name}</span>
                      <span className="text-sm font-medium">{criteria.score}/200</span>
                    </div>
                    <Progress value={(criteria.score / 200) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Feedback */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Feedback Detalhado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assessment.feedback.strengths.map((strength, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{strength}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Text Preview */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Texto Analisado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg max-h-60 overflow-y-auto">
                <p className="text-sm whitespace-pre-wrap">{assessment.text}</p>
              </div>

              {/* Botão Nova Análise */}
              <div className="flex justify-center mt-6">
                <Button onClick={handleNewAnalysis} className="bg-yellow-500 hover:bg-yellow-600 text-white" size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Iniciar Nova Análise
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
