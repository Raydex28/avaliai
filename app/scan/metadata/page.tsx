"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { useClass } from "@/contexts/class-context"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function MetadataPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { currentClass } = useClass() // Get current class from context
  const { toast } = useToast()

  const [metadata, setMetadata] = useState({
    studentName: "",
  })

  // Extrair parâmetros da URL
  const extractedText = searchParams.get("text") || ""
  const isValid = searchParams.get("isValid") === "true"
  const reason = searchParams.get("reason") || ""
  const textType = searchParams.get("textType") || ""

  // Verificar autenticação
  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  // Se o usuário não estiver autenticado, não renderize o conteúdo
  if (!user) {
    return null
  }

  const handleSubmitMetadata = () => {
    if (!metadata.studentName) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, informe o nome do aluno antes de continuar.",
      })
      return
    }

    // Include the current class ID in the URL parameters
    const params = new URLSearchParams({
      text: extractedText,
      student: metadata.studentName,
      subject: "Redação",
      template: "template-enem",
    })

    // Add class ID if available
    if (currentClass?.id) {
      params.set("classId", currentClass.id)
    }

    // Navegar para a tela de resultados com os dados
    router.push(`/results?${params.toString()}`)
  }

  const handleEditText = () => {
    // Voltar para a página de escaneamento com o texto atual
    router.push("/scan")
  }

  return (
    <DashboardLayout>
      <div className="flex items-center mb-4">
        <h1 className="text-xl font-bold">Informações da Redação</h1>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            {!isValid && (
              <Alert variant="warning" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Aviso: Texto não dissertativo-argumentativo</AlertTitle>
                <AlertDescription>
                  {reason}
                  <br />
                  Tipo de texto identificado: {textType}
                </AlertDescription>
              </Alert>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-medium">Texto para Análise</h2>
                <Button variant="outline" size="sm" onClick={handleEditText}>
                  Editar Texto
                </Button>
              </div>
              <div className="bg-muted p-3 rounded-md text-sm max-h-40 overflow-y-auto">
                {extractedText || (
                  <span className="text-muted-foreground italic">Nenhum texto foi extraído ou reconhecido.</span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium">Informações da Redação</h2>

              {currentClass && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Turma selecionada:</strong> {currentClass.name}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="studentName">Nome do Aluno</Label>
                <Input
                  id="studentName"
                  value={metadata.studentName}
                  onChange={(e) => setMetadata((prev) => ({ ...prev, studentName: e.target.value }))}
                  placeholder="Ex: Maria Silva"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => router.push("/scan")}>
                Voltar
              </Button>
              <Button onClick={handleSubmitMetadata}>Analisar com IA</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
