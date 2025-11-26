"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Upload, PenTool, Smartphone, Monitor, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useDeviceType } from "@/hooks/use-device-type"
import { FileUpload } from "@/components/file-upload"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useClass } from "@/contexts/class-context"
import { ClassSelector } from "@/components/class-selector"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ScanPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const { deviceType, isMobile, isDesktop } = useDeviceType()
  const { currentClass } = useClass()
  const [extractedText, setExtractedText] = useState<string>("")
  const [manualText, setManualText] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>(isDesktop ? "upload" : "camera")

  // Verificar autenticação
  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  // Atualizar a aba ativa com base no tipo de dispositivo
  useEffect(() => {
    setActiveTab(isDesktop ? "upload" : "camera")
  }, [isDesktop])

  // Se o usuário não estiver autenticado, não renderize o conteúdo
  if (!user) {
    return null
  }

  const handleStartCamera = () => {
    router.push("/scan/camera")
  }

  const handleFileTextExtracted = async (text: string) => {
    setExtractedText(text)
    setManualText(text)

    // Prosseguir diretamente para análise
    await proceedToAnalysis(text)
  }

  const handleSubmitManualEntry = async () => {
    if (!manualText.trim()) {
      toast({
        variant: "destructive",
        title: "Texto vazio",
        description: "Por favor, digite o texto da redação.",
      })
      return
    }

    if (!currentClass) {
      toast({
        variant: "destructive",
        title: "Nenhuma turma selecionada",
        description: "Por favor, selecione uma turma antes de continuar.",
      })
      return
    }

    setExtractedText(manualText)
    await proceedToAnalysis(manualText)
  }

  const proceedToAnalysis = async (text: string) => {
    if (!currentClass) {
      toast({
        variant: "destructive",
        title: "Nenhuma turma selecionada",
        description: "Por favor, selecione uma turma antes de continuar.",
      })
      return
    }

    try {
      // Verificação básica de qualidade do texto
      const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length
      let isValid = true
      let reason = ""
      let textType = "dissertativo-argumentativo"

      if (wordCount < 20) {
        isValid = false
        reason = "Texto muito curto para análise"
        textType = "insuficiente"
      } else if (wordCount < 100) {
        reason = "Texto curto - análise pode ser limitada"
      } else {
        reason = "Texto adequado para análise completa"
      }

      // Redirecionar para a página de metadados
      const params = new URLSearchParams({
        text: text,
        isValid: isValid.toString(),
        reason: reason,
        textType: textType,
        classId: currentClass.id,
        className: currentClass.name,
      })

      router.push(`/scan/metadata?${params.toString()}`)
    } catch (error) {
      console.error("Erro ao processar texto:", error)

      // Em caso de erro, permitir que o usuário continue
      const params = new URLSearchParams({
        text: text,
        isValid: "true",
        reason: "Processamento local",
        textType: "dissertativo-argumentativo",
        classId: currentClass.id,
        className: currentClass.name,
      })

      router.push(`/scan/metadata?${params.toString()}`)

      toast({
        title: "Processando",
        description: "Prosseguindo com análise local da redação.",
      })
    }
  }

  // Renderizar a interface de upload de arquivo
  const renderFileUploadInterface = () => {
    return (
      <div className="flex-1 p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-medium mb-4">Envie um arquivo com o texto da redação</h2>
            <p className="text-muted-foreground mb-6">
              Faça upload de um arquivo contendo o texto da redação para análise. Suportamos arquivos DOCX, RTF e TXT.
            </p>

            <FileUpload
              onTextExtracted={(text) => {
                setManualText(text)
                handleFileTextExtracted(text)
              }}
              onError={(errorMsg) => {
                setError(errorMsg)
                toast({
                  variant: "destructive",
                  title: "Erro ao processar arquivo",
                  description: errorMsg,
                })
              }}
            />
          </div>

          <div className="border-t pt-6 mt-8">
            <h3 className="text-lg font-medium mb-4">Ou digite o texto manualmente</h3>
            <Textarea
              placeholder="Digite aqui o texto completo da redação..."
              className="min-h-[200px]"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
            />

            <div className="flex justify-end mt-4">
              <Button onClick={handleSubmitManualEntry} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                Continuar
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Renderizar a interface de câmera para mobile
  const renderCameraInterface = () => {
    return (
      <div className="flex-1 p-6">
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-4">
              <Camera className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="text-xl font-medium mb-4">Escanear Redação Manuscrita</h2>
            <p className="text-muted-foreground mb-6">
              Use a câmera do seu dispositivo para capturar uma imagem da redação manuscrita. Nossa IA irá extrair o
              texto automaticamente.
            </p>

            <Button
              size="lg"
              onClick={handleStartCamera}
              className="w-full max-w-sm bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              <Camera className="h-5 w-5 mr-2" />
              Abrir Câmera
            </Button>
          </div>

          <div className="border-t pt-6 mt-8">
            <h3 className="text-lg font-medium mb-4">Ou digite o texto manualmente</h3>
            <Textarea
              placeholder="Digite aqui o texto completo da redação manuscrita..."
              className="min-h-[200px]"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
            />

            <div className="flex justify-end mt-4">
              <Button onClick={handleSubmitManualEntry} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                Continuar
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-xl font-bold">Nova Redação</h1>

          <div className="flex items-center gap-2">
            <ClassSelector />
          </div>
        </div>

        {!currentClass && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Atenção!</AlertTitle>
            <AlertDescription>
              Selecione uma turma antes de continuar. A redação será associada à turma selecionada.
            </AlertDescription>
          </Alert>
        )}

        {currentClass && (
          <Alert className="mb-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <AlertTitle className="text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
              <span className="font-semibold">Turma selecionada: {currentClass.name}</span>
            </AlertTitle>
            <AlertDescription className="text-yellow-700 dark:text-yellow-400">
              A redação será associada a esta turma. Certifique-se de que está correta antes de continuar.
            </AlertDescription>
          </Alert>
        )}

        <Card className="flex-1 flex flex-col">
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Mostrar abas apenas se não for desktop */}
            {!isDesktop && (
              <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
                <div className="border-b px-4">
                  <TabsList className="h-12">
                    <TabsTrigger value="camera" className="flex items-center gap-2">
                      <PenTool className="h-4 w-4" />
                      <span>Escanear</span>
                    </TabsTrigger>
                    <TabsTrigger value="upload" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      <span>Arquivo</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="camera" className="flex-1 flex flex-col mt-0">
                  {renderCameraInterface()}
                </TabsContent>

                <TabsContent value="upload" className="flex-1 flex flex-col mt-0">
                  {renderFileUploadInterface()}
                </TabsContent>
              </Tabs>
            )}

            {/* Em desktop, mostrar apenas a interface de upload */}
            {isDesktop && renderFileUploadInterface()}

            {/* Mostrar informações sobre o dispositivo */}
            <div className="p-4 bg-muted/50 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {isDesktop ? (
                  <>
                    <Monitor className="h-4 w-4" />
                    <span>Modo Desktop - Upload de arquivos otimizado</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="h-4 w-4" />
                    <span>Modo Mobile - Escaneamento com câmera disponível</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
