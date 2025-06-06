"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Download, FileText, TrendingUp } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PDFDownloadLink } from "@/components/pdf-download-link"
import { useAuth } from "@/contexts/auth-context"
import { analyzeWithGemini } from "@/services/ai-service"
import { saveAssessment, getAssessment } from "@/services/assessment-service"
import { getCriteriaTemplates } from "@/services/criteria-service"
import type { Assessment } from "@/types/assessment"

interface AIAnalysisResult {
  grade: number
  feedback: {
    strengths: string[]
    improvements: string[]
    competencies: {
      name: string
      score: number
      maxPoints: number
      feedback: string
    }[]
  }
  criteriaScores: {
    name: string
    score: number
    maxPoints: number
    weight: number
  }[]
  textQuality: "high" | "medium" | "low" | "insufficient"
}

export default function ResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get parameters from URL
  const assessmentId = searchParams.get("id")
  const text = searchParams.get("text")
  const studentName = searchParams.get("student")
  const subject = searchParams.get("subject")
  const template = searchParams.get("template")
  const classId = searchParams.get("classId") // Get classId from URL

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    fetchData()
  }, [user, router, assessmentId, text, studentName, subject, template, classId])

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (assessmentId) {
        // Load existing assessment
        const existingAssessment = await getAssessment(assessmentId)
        if (existingAssessment) {
          setAssessment(existingAssessment)
        } else {
          setError("Avaliação não encontrada.")
        }
      } else if (text && studentName) {
        // Process new analysis
        await processNewAnalysis()
      } else {
        setError("Parâmetros insuficientes para carregar ou processar a avaliação.")
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      setError("Erro ao carregar os dados da avaliação.")
    } finally {
      setIsLoading(false)
    }
  }

  const processNewAnalysis = async () => {
    if (!text || !studentName) return

    try {
      // Get criteria templates
      const templates = await getCriteriaTemplates()
      const selectedTemplate = templates.find((t) => t.id === template) || templates[0]

      if (!selectedTemplate) {
        throw new Error("Template de critérios não encontrado")
      }

      // Analyze with AI
      const analysisResult: AIAnalysisResult = await analyzeWithGemini(text, selectedTemplate.criteria)

      // Create assessment object
      const newAssessment: Partial<Assessment> = {
        studentName: studentName,
        subject: subject || "Redação",
        text: text,
        criteria: selectedTemplate.criteria,
        grade: analysisResult.grade,
        feedback: {
          strengths: analysisResult.feedback.strengths,
          improvements: analysisResult.feedback.improvements,
        },
        criteriaScores: analysisResult.criteriaScores.map((score) => ({
          name: score.name,
          score: score.score,
          weight: score.weight,
        })),
        classId: classId || undefined, // Include classId in the assessment
      }

      // Save assessment
      const savedId = await saveAssessment(newAssessment)
      newAssessment.id = savedId

      setAssessment(newAssessment as Assessment)
    } catch (error) {
      console.error("Erro ao processar análise:", error)
      setError("Erro ao processar a análise da redação.")
    }
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 900) return "text-green-600"
    if (grade >= 700) return "text-blue-600"
    if (grade >= 500) return "text-yellow-600"
    return "text-red-600"
  }

  const getGradeBadgeVariant = (grade: number) => {
    if (grade >= 900) return "default"
    if (grade >= 700) return "secondary"
    if (grade >= 500) return "outline"
    return "destructive"
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
            <p className="text-muted-foreground">Analisando redação...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => router.push("/dashboard")}>Voltar ao Dashboard</Button>
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
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-green-700 mb-3">Pontos Fortes</h3>
                  <ul className="space-y-2">
                    {assessment.feedback.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-orange-700 mb-3">Pontos de Melhoria</h3>
                  <ul className="space-y-2">
                    {assessment.feedback.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
