"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, Edit, Save, Loader2, AlertTriangle, FileText, PenTool } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { analyzeWithGemini } from "@/services/ai-service"
import { saveAssessment } from "@/services/assessment-service"
import { getCriteriaTemplate } from "@/services/criteria-service"
import { Skeleton } from "@/components/ui/skeleton"
import { PDFDownloadLink } from "@/components/pdf-download-link"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard-layout"

interface CriteriaScore {
  name: string
  score: number
  maxPoints: number
  weight: number
}

interface CompetencyFeedback {
  name: string
  score: number
  maxPoints: number
  feedback: string
}

interface AIAnalysis {
  grade: number
  feedback: {
    strengths: string[]
    improvements: string[]
    competencies: CompetencyFeedback[]
  }
  criteriaScores: CriteriaScore[]
  textQuality?: "high" | "medium" | "low" | "insufficient"
}

export default function ResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { user } = useAuth()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [finalGrade, setFinalGrade] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
  const [assessmentId, setAssessmentId] = useState<string | null>(null)
  const [originalText, setOriginalText] = useState<string>("")
  const [editedScores, setEditedScores] = useState<{ [key: string]: number }>({})

  // Obter parâmetros da URL
  const text = searchParams.get("text")
  const studentName = searchParams.get("student")
  const subject = searchParams.get("subject") || "Redação"
  const templateId = searchParams.get("template")

  // Verificar autenticação
  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!text || !templateId) {
        toast({
          variant: "destructive",
          title: "Dados insuficientes",
          description: "Informações necessárias para análise estão faltando.",
        })
        router.push("/scan")
        return
      }

      setOriginalText(text)

      try {
        // Obter o modelo de critérios
        const template = await getCriteriaTemplate(templateId)

        if (!template) {
          toast({
            variant: "destructive",
            title: "Modelo não encontrado",
            description: "O modelo de critérios selecionado não foi encontrado.",
          })
          router.push("/scan")
          return
        }

        // Analisar o texto com a API Gemini
        const result = await analyzeWithGemini(text, template.criteria)

        setAiAnalysis(result)
        setFinalGrade(result.grade)

        // Inicializar os scores editáveis
        const initialScores: { [key: string]: number } = {}
        result.criteriaScores.forEach((criteria) => {
          initialScores[criteria.name] = criteria.score
        })
        setEditedScores(initialScores)

        setIsLoading(false)

        // Salvar a avaliação no banco de dados
        const savedId = await saveAssessment({
          studentName: studentName || "Aluno não identificado",
          subject: "Redação",
          text,
          criteria: template.criteria,
          grade: result.grade,
          feedback: result.feedback,
          criteriaScores: result.criteriaScores,
        })

        setAssessmentId(savedId)
      } catch (error) {
        console.error("Erro ao analisar texto:", error)
        toast({
          variant: "destructive",
          title: "Erro na análise",
          description: "Ocorreu um erro ao analisar o texto. Tente novamente.",
        })
        setIsLoading(false)
      }
    }

    if (user) {
      fetchAnalysis()
    }
  }, [text, templateId, studentName, subject, toast, router, user])

  const handleSaveGrade = async () => {
    if (!assessmentId || !aiAnalysis) return

    setIsSaving(true)

    try {
      // Calcular a nova nota total
      const updatedCriteriaScores = aiAnalysis.criteriaScores.map((criteria) => ({
        ...criteria,
        score: editedScores[criteria.name] || criteria.score,
      }))

      const newGrade = updatedCriteriaScores.reduce((sum, c) => sum + c.score, 0)

      // Atualizar a nota no banco de dados
      await saveAssessment({
        id: assessmentId,
        grade: newGrade,
        // Manter os outros dados iguais
        studentName: studentName || "Aluno não identificado",
        subject: "Redação",
        text: text || "",
        criteria: [],
        feedback: {
          ...aiAnalysis.feedback,
          // Não atualizamos o feedback específico das competências aqui
        },
        criteriaScores: updatedCriteriaScores,
      })

      // Atualizar o estado local
      setFinalGrade(newGrade)
      setAiAnalysis({
        ...aiAnalysis,
        grade: newGrade,
        criteriaScores: updatedCriteriaScores,
      })

      toast({
        title: "Nota atualizada",
        description: "A nota foi atualizada com sucesso.",
      })

      setIsEditing(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar a nota. Tente novamente.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleScoreChange = (competencyName: string, value: number) => {
    setEditedScores((prev) => ({
      ...prev,
      [competencyName]: value,
    }))

    // Recalcular a nota total
    if (aiAnalysis) {
      const newTotal = aiAnalysis.criteriaScores.reduce((sum, criteria) => {
        const score = criteria.name === competencyName ? value : editedScores[criteria.name] || criteria.score
        return sum + score
      }, 0)

      setFinalGrade(newTotal)
    }
  }

  // Função para obter a cor baseada na pontuação
  const getScoreColor = (score: number, maxPoints: number) => {
    const percentage = score / maxPoints
    if (percentage >= 0.8) return "bg-green-500"
    if (percentage >= 0.6) return "bg-blue-500"
    if (percentage >= 0.4) return "bg-yellow-500"
    if (percentage >= 0.2) return "bg-orange-500"
    return "bg-red-500"
  }

  // Se o usuário não estiver autenticado, não renderize o conteúdo
  if (!user) {
    return null
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        {/* Barra de navegação superior */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3 flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center ml-2">
              <PenTool className="h-5 w-5 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-blue-600">AvaliAI</h1>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center mb-6">
            <FileText className="h-5 w-5 text-blue-600 mr-2" />
            <h1 className="text-xl font-bold">Análise da Redação</h1>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Analisando...</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <Loader2 className="h-16 w-16 animate-spin text-blue-600 mb-4" />
                  <p className="text-center">A IA está analisando a redação...</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-1 sm:mr-2" />
            <h1 className="text-base sm:text-xl font-bold">Análise da Redação</h1>
          </div>
          {studentName && (
            <Badge variant="outline" className="text-xs sm:text-sm">
              Aluno: {studentName}
            </Badge>
          )}
        </div>

        <div className="grid gap-4">
          {aiAnalysis && aiAnalysis.textQuality && aiAnalysis.textQuality !== "high" && (
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Qualidade do texto limitada</AlertTitle>
              <AlertDescription>
                O texto extraído tem qualidade{" "}
                {aiAnalysis.textQuality === "medium"
                  ? "média"
                  : aiAnalysis.textQuality === "low"
                    ? "baixa"
                    : "insuficiente"}
                . A análise e as notas podem não ser precisas.
              </AlertDescription>
            </Alert>
          )}

          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg text-gray-700">Nota Final</CardTitle>
                  <p className="text-sm text-gray-500">Redação ENEM</p>
                </div>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-1" /> Ajustar Notas
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleSaveGrade} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-1" /> Salvar
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-4">
                <div className="text-5xl font-bold text-blue-600 mb-2">{finalGrade}</div>
                <p className="text-sm text-gray-500">Escala: 0 a 1000</p>

                {aiAnalysis && <p className="text-sm text-gray-500 mt-2">Nota sugerida pela IA: {aiAnalysis.grade}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Competências do ENEM */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-lg text-gray-700">Competências</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-6">
                {aiAnalysis &&
                  aiAnalysis.criteriaScores.map((criteria, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{criteria.name}</h3>
                        <div className="flex items-center">
                          <span className="font-bold text-lg">
                            {isEditing ? editedScores[criteria.name] || criteria.score : criteria.score}
                          </span>
                          <span className="text-gray-500 text-sm ml-1">/{criteria.maxPoints}</span>
                        </div>
                      </div>

                      {isEditing ? (
                        <Slider
                          value={[editedScores[criteria.name] || criteria.score]}
                          min={0}
                          max={criteria.maxPoints}
                          step={20}
                          onValueChange={(value) => handleScoreChange(criteria.name, value[0])}
                          className="my-2"
                        />
                      ) : (
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${getScoreColor(criteria.score, criteria.maxPoints)}`}
                            style={{ width: `${(criteria.score / criteria.maxPoints) * 100}%` }}
                          ></div>
                        </div>
                      )}

                      {aiAnalysis.feedback.competencies && aiAnalysis.feedback.competencies[index] && (
                        <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-md text-sm">
                          {aiAnalysis.feedback.competencies[index].feedback}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="feedback" className="bg-white shadow-sm rounded-md">
            <TabsList className="grid w-full grid-cols-2 p-0 rounded-t-md">
              <TabsTrigger value="feedback" className="rounded-none rounded-tl-md py-3">
                Feedback Geral
              </TabsTrigger>
              <TabsTrigger value="text" className="rounded-none rounded-tr-md py-3">
                Texto Original
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feedback" className="p-4">
              <div className="space-y-4">
                {aiAnalysis && aiAnalysis.feedback.strengths.length > 0 ? (
                  <div>
                    <h3 className="font-medium text-green-600 mb-2">Pontos Fortes</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {aiAnalysis.feedback.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-2">Pontos Fortes</h3>
                    <p className="text-muted-foreground italic">Nenhum ponto forte identificado.</p>
                  </div>
                )}

                {aiAnalysis && aiAnalysis.feedback.improvements.length > 0 ? (
                  <div>
                    <h3 className="font-medium text-amber-600 mb-2">Áreas para Melhoria</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {aiAnalysis.feedback.improvements.map((improvement, index) => (
                        <li key={index}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-2">Áreas para Melhoria</h3>
                    <p className="text-muted-foreground italic">Nenhuma área de melhoria identificada.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="text" className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Texto Extraído da Imagem</h3>
                  {aiAnalysis && aiAnalysis.textQuality && (
                    <Badge
                      variant={
                        aiAnalysis.textQuality === "high"
                          ? "default"
                          : aiAnalysis.textQuality === "medium"
                            ? "secondary"
                            : "warning"
                      }
                    >
                      Qualidade:{" "}
                      {aiAnalysis.textQuality === "high"
                        ? "Alta"
                        : aiAnalysis.textQuality === "medium"
                          ? "Média"
                          : aiAnalysis.textQuality === "low"
                            ? "Baixa"
                            : "Insuficiente"}
                    </Badge>
                  )}
                </div>
                <div className="bg-muted p-4 rounded-md text-sm max-h-80 overflow-y-auto whitespace-pre-wrap">
                  {originalText || (
                    <span className="text-muted-foreground italic">
                      Nenhum texto foi extraído ou reconhecido na imagem.
                    </span>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Card>
            <CardFooter className="justify-between p-4">
              {assessmentId && aiAnalysis && (
                <PDFDownloadLink
                  assessmentData={{
                    id: assessmentId,
                    studentName: studentName || "Aluno não identificado",
                    subject: "Redação",
                    grade: finalGrade,
                    feedback: aiAnalysis.feedback,
                    criteriaScores: aiAnalysis.criteriaScores.map((c) => ({
                      ...c,
                      score: editedScores[c.name] || c.score,
                    })),
                    date: new Date().toISOString(),
                  }}
                >
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" /> Exportar PDF
                  </Button>
                </PDFDownloadLink>
              )}
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/")}>
                Concluído
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
