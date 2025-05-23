"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Loader2,
  RefreshCw,
  AlertTriangle,
  User,
  FileText,
  Package,
  CheckCircle,
  AlertCircle,
  XCircle,
  PenTool,
  FlashlightOffIcon as FlashOff,
  FlashlightIcon as Flash,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { processOCR, type OCRResult } from "@/services/ocr-service"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

export default function CameraPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [captureMode, setCaptureMode] = useState<
    "ready" | "processing" | "preview" | "metadata" | "wrong-content" | "low-quality" | "manual-entry" | "verifying"
  >("ready")
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState<string>("")
  const [manualText, setManualText] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [metadata, setMetadata] = useState({
    studentName: "",
  })
  const [contentAnalysis, setContentAnalysis] = useState<OCRResult | null>(null)
  const [textVerification, setTextVerification] = useState<{
    isValid: boolean
    reason: string
    textType: string
  } | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [flashEnabled, setFlashEnabled] = useState(false)

  // Verificar autenticação
  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  // Inicializar a câmera em tela cheia
  useEffect(() => {
    const startCamera = async () => {
      try {
        const constraints = {
          video: {
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
        setStream(mediaStream)

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }

        // Configurar flash se disponível
        const track = mediaStream.getVideoTracks()[0]
        const capabilities = track.getCapabilities()
        if (capabilities.torch) {
          // Flash disponível
        }
      } catch (err) {
        setError("Não foi possível acessar a câmera. Verifique as permissões.")
        console.error("Erro ao acessar a câmera:", err)
      }
    }

    if (captureMode === "ready" && user) {
      startCamera()
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [captureMode, user])

  // Simular progresso durante o processamento
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (captureMode === "processing") {
      setProgress(0)
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return prev
          }
          return prev + 5
        })
      }, 200)
    }

    return () => {
      clearInterval(interval)
    }
  }, [captureMode])

  // Se o usuário não estiver autenticado, não renderize o conteúdo
  if (!user) {
    return null
  }

  const toggleFlash = async () => {
    if (stream) {
      const track = stream.getVideoTracks()[0]
      const capabilities = track.getCapabilities()

      if (capabilities.torch) {
        try {
          await track.applyConstraints({
            advanced: [{ torch: !flashEnabled }],
          })
          setFlashEnabled(!flashEnabled)
        } catch (err) {
          console.error("Erro ao controlar o flash:", err)
        }
      }
    }
  }

  const handleCapture = () => {
    if (!canvasRef.current || !videoRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current

    // Configurar o canvas para corresponder às dimensões do vídeo
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Desenhar o quadro atual do vídeo no canvas
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Converter para imagem
    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9)
    setPreviewImage(imageDataUrl)
    setCaptureMode("preview")

    // Parar a câmera
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }

    // Remove the automatic processing - let user choose
  }

  const handleRetake = () => {
    setPreviewImage(null)
    setExtractedText("")
    setManualText("")
    setProgress(0)
    setError(null)
    setContentAnalysis(null)
    setTextVerification(null)
    setCaptureMode("ready")
  }

  const handleBack = () => {
    // Parar a câmera antes de voltar
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    router.push("/scan")
  }

  const handleProcessOCR = async () => {
    if (!previewImage) return

    setCaptureMode("processing")
    setError(null)

    try {
      // Processar OCR na imagem
      const result = await processOCR(previewImage)
      setContentAnalysis(result)

      // Verificar se a imagem contém texto
      if (!result.hasText || result.contentType !== "document") {
        setCaptureMode("wrong-content")
        return
      }

      // Verificar a qualidade do texto
      if (result.textQuality === "insufficient" || result.textQuality === "low") {
        setCaptureMode("low-quality")
        setExtractedText(result.text)
        return
      }

      setExtractedText(result.text)

      // Simular conclusão do processamento
      setProgress(100)

      setTimeout(() => {
        // Verificar o tipo de texto antes de prosseguir
        verifyTextType(result.text)
      }, 500)
    } catch (err) {
      setError("Erro ao processar a imagem. Tente novamente.")
      setCaptureMode("preview")
    }
  }

  const handleManualEntry = () => {
    setCaptureMode("manual-entry")
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

    setExtractedText(manualText)

    // Verificar o tipo de texto antes de prosseguir
    await verifyTextType(manualText)
  }

  const verifyTextType = async (text: string) => {
    setIsVerifying(true)
    setCaptureMode("verifying")

    try {
      const response = await fetch("/api/verify-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error("Falha ao verificar o tipo de texto")
      }

      const result = await response.json()
      setTextVerification(result)

      if (result.isValid) {
        setCaptureMode("metadata")
      } else {
        // Manter no modo de verificação para mostrar o alerta
        setCaptureMode("verifying")
      }
    } catch (error) {
      console.error("Erro ao verificar o tipo de texto:", error)
      // Em caso de erro, permitir que o usuário continue
      setCaptureMode("metadata")
      toast({
        variant: "warning",
        title: "Aviso",
        description: "Não foi possível verificar o tipo de texto. Prosseguindo com a análise.",
      })
    } finally {
      setIsVerifying(false)
    }
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

    // Navegar para a tela de resultados com os dados
    router.push(
      `/results?text=${encodeURIComponent(extractedText)}&student=${encodeURIComponent(metadata.studentName)}&subject=Redação&template=template-enem`,
    )
  }

  // Função para renderizar o ícone apropriado com base no tipo de conteúdo
  const renderContentIcon = () => {
    if (!contentAnalysis) return null

    switch (contentAnalysis.contentType) {
      case "person":
        return <User className="h-16 w-16 text-blue-500 mb-4" />
      case "document":
        return <FileText className="h-16 w-16 text-green-500 mb-4" />
      case "object":
        return <Package className="h-16 w-16 text-amber-500 mb-4" />
      default:
        return <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
    }
  }

  // Função para renderizar o ícone de qualidade do texto
  const renderQualityIcon = () => {
    if (!contentAnalysis || !contentAnalysis.textQuality) return null

    switch (contentAnalysis.textQuality) {
      case "high":
        return <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      case "medium":
        return <AlertCircle className="h-16 w-16 text-amber-500 mb-4" />
      case "low":
      case "insufficient":
        return <XCircle className="h-16 w-16 text-red-500 mb-4" />
      default:
        return <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
    }
  }

  // Função para obter a mensagem apropriada com base no tipo de conteúdo
  const getContentMessage = () => {
    if (!contentAnalysis) return "Conteúdo não identificado"

    switch (contentAnalysis.contentType) {
      case "person":
        return "Uma pessoa foi detectada na imagem. Para análise de redações, capture uma imagem de um documento com texto."
      case "object":
        return "Um objeto foi detectado na imagem. Não foi possível extrair texto. Por favor, capture uma imagem de uma redação manuscrita ou digite manualmente."
      case "unknown":
        return "Não foi possível identificar o conteúdo da imagem. Tente novamente com melhor iluminação."
      default:
        return "Tipo de conteúdo não suportado para análise de redações."
    }
  }

  // Função para obter a mensagem apropriada com base na qualidade do texto
  const getQualityMessage = () => {
    if (!contentAnalysis || !contentAnalysis.textQuality) return "Qualidade do texto não identificada"

    switch (contentAnalysis.textQuality) {
      case "high":
        return "O texto foi reconhecido com alta qualidade e está pronto para análise."
      case "medium":
        return "O texto foi reconhecido com qualidade média. A análise pode não ser tão precisa."
      case "low":
        return "O texto foi reconhecido com baixa qualidade. Recomendamos capturar novamente a imagem com melhor iluminação e foco."
      case "insufficient":
        return "Texto insuficiente para análise. Capture uma imagem com mais conteúdo textual."
      default:
        return "Não foi possível determinar a qualidade do texto."
    }
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header da câmera */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/50 to-transparent p-4">
        <div className="flex items-center justify-between text-white">
          <Button variant="ghost" size="icon" onClick={handleBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="h-6 w-6" />
          </Button>

          <h1 className="text-lg font-medium">Escanear Redação</h1>

          <Button variant="ghost" size="icon" onClick={toggleFlash} className="text-white hover:bg-white/20">
            {flashEnabled ? <Flash className="h-6 w-6" /> : <FlashOff className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {captureMode === "ready" && (
        <div className="relative flex-1 flex flex-col items-center justify-center">
          <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />

          {/* Instruções */}
          <div className="absolute top-20 left-4 right-4 z-10">
            <div className="text-white text-center p-4 bg-black/50 rounded-lg">
              <PenTool className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Posicione a redação manuscrita dentro do quadro e garanta boa iluminação</p>
            </div>
          </div>

          {/* Quadro de captura */}
          <div className="absolute inset-8 border-2 border-white border-dashed rounded-lg z-10 flex items-center justify-center">
            <div className="absolute top-4 left-4 w-6 h-6 border-l-4 border-t-4 border-white rounded-tl-lg"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-r-4 border-t-4 border-white rounded-tr-lg"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-l-4 border-b-4 border-white rounded-bl-lg"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-r-4 border-b-4 border-white rounded-br-lg"></div>
          </div>

          {/* Botão de captura */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20">
            <Button
              size="lg"
              className="rounded-full h-20 w-20 bg-white hover:bg-gray-100 text-black shadow-lg"
              onClick={handleCapture}
            >
              <div className="h-16 w-16 rounded-full border-4 border-black flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-black"></div>
              </div>
            </Button>
          </div>

          {/* Canvas escondido para captura */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {captureMode === "processing" && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-white">
          <Loader2 className="h-16 w-16 animate-spin text-white mb-4" />
          <p className="text-center mb-4">Analisando redação...</p>
          <div className="w-full max-w-md">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      )}

      {captureMode === "verifying" && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-white">
          {isVerifying ? (
            <>
              <Loader2 className="h-16 w-16 animate-spin text-white mb-4" />
              <p className="text-center mb-4">Verificando o tipo de texto...</p>
            </>
          ) : textVerification && !textVerification.isValid ? (
            <div className="w-full max-w-md space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Texto não dissertativo-argumentativo</AlertTitle>
                <AlertDescription>
                  {textVerification.reason}
                  <br />
                  Tipo de texto identificado: {textVerification.textType}
                </AlertDescription>
              </Alert>

              <div className="bg-black/50 p-3 rounded-md text-sm max-h-40 overflow-y-auto text-white">
                <p className="font-medium mb-2">Texto analisado:</p>
                {extractedText}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleRetake} className="text-black">
                  Capturar novamente
                </Button>
                <Button variant="default" onClick={() => setCaptureMode("metadata")}>
                  Continuar mesmo assim
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {captureMode === "preview" && previewImage && (
        <div className="relative flex-1 flex flex-col">
          <div className="flex-1 bg-black flex items-center justify-center">
            <img
              src={previewImage || "/placeholder.svg"}
              alt="Imagem capturada"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                onClick={handleRetake}
                className="bg-white text-black hover:bg-gray-100 border-white flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Refazer
              </Button>
              <Button
                variant="outline"
                onClick={handleManualEntry}
                className="bg-white text-black hover:bg-gray-100 border-white flex-1"
              >
                Digitar Texto
              </Button>
              <Button onClick={handleProcessOCR} className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
                Analisar
              </Button>
            </div>
          </div>
        </div>
      )}

      {(captureMode === "wrong-content" ||
        captureMode === "low-quality" ||
        captureMode === "manual-entry" ||
        captureMode === "metadata") && (
        <div className="flex-1 bg-white text-black overflow-auto">
          <Card className="h-full rounded-none border-0">
            <CardContent className="p-4">
              {captureMode === "wrong-content" && contentAnalysis && (
                <div className="space-y-4">
                  <div className="flex flex-col items-center text-center">
                    {renderContentIcon()}
                    <h3 className="text-lg font-medium mb-2">
                      Conteúdo Detectado:{" "}
                      {contentAnalysis.contentType.charAt(0).toUpperCase() + contentAnalysis.contentType.slice(1)}
                    </h3>
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {contentAnalysis.contentDescription?.map((desc, index) => (
                        <Badge key={index} variant="outline">
                          {desc}
                        </Badge>
                      ))}
                    </div>
                    <Alert variant="warning" className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Nenhum texto detectado</AlertTitle>
                      <AlertDescription>{getContentMessage()}</AlertDescription>
                    </Alert>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handleRetake}>
                      <RefreshCw className="h-4 w-4 mr-2" /> Capturar novamente
                    </Button>
                    <Button variant="secondary" onClick={handleManualEntry}>
                      Digitar Texto Manualmente
                    </Button>
                  </div>
                </div>
              )}

              {captureMode === "low-quality" && contentAnalysis && (
                <div className="space-y-4">
                  <div className="flex flex-col items-center text-center">
                    {renderQualityIcon()}
                    <h3 className="text-lg font-medium mb-2">
                      Qualidade do Texto: {contentAnalysis.textQuality === "low" ? "Baixa" : "Insuficiente"}
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline">{contentAnalysis.wordCount} palavras detectadas</Badge>
                      <Badge variant={contentAnalysis.confidence > 0.7 ? "default" : "warning"}>
                        Confiança: {Math.round(contentAnalysis.confidence * 100)}%
                      </Badge>
                    </div>
                    <Alert variant="warning" className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Texto de baixa qualidade</AlertTitle>
                      <AlertDescription>{getQualityMessage()}</AlertDescription>
                    </Alert>
                    <div className="bg-muted p-3 rounded-md text-sm max-h-40 overflow-y-auto w-full text-left">
                      <p className="font-medium mb-2">Texto extraído:</p>
                      {extractedText || (
                        <span className="text-muted-foreground italic">
                          Nenhum texto foi extraído ou reconhecido na imagem.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handleRetake}>
                      <RefreshCw className="h-4 w-4 mr-2" /> Capturar novamente
                    </Button>
                    <Button variant="secondary" onClick={handleManualEntry}>
                      Digitar Texto Manualmente
                    </Button>
                  </div>
                </div>
              )}

              {captureMode === "manual-entry" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium mb-4">Digite o Texto da Redação</h2>
                    <Textarea
                      placeholder="Digite aqui o texto completo da redação manuscrita..."
                      className="min-h-[300px]"
                      value={manualText}
                      onChange={(e) => setManualText(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setCaptureMode("preview")}>
                      Voltar
                    </Button>
                    <Button onClick={handleSubmitManualEntry}>Continuar</Button>
                  </div>
                </div>
              )}

              {captureMode === "metadata" && (
                <div className="space-y-6">
                  {contentAnalysis &&
                    (contentAnalysis.contentType !== "document" || contentAnalysis.textQuality !== "high") && (
                      <Alert variant="warning" className="mb-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Atenção:{" "}
                          {contentAnalysis.contentType !== "document"
                            ? "A imagem não parece ser um documento."
                            : "O texto foi reconhecido com qualidade limitada."}{" "}
                          A análise pode não ser precisa.
                        </AlertDescription>
                      </Alert>
                    )}

                  {textVerification && !textVerification.isValid && (
                    <Alert variant="warning" className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Aviso: Texto não dissertativo-argumentativo</AlertTitle>
                      <AlertDescription>
                        {textVerification.reason}
                        <br />
                        Tipo de texto identificado: {textVerification.textType}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-lg font-medium">Texto para Análise</h2>
                      <Button variant="outline" size="sm" onClick={handleManualEntry}>
                        Editar Texto
                      </Button>
                    </div>
                    <div className="bg-muted p-3 rounded-md text-sm max-h-40 overflow-y-auto">
                      {extractedText || (
                        <span className="text-muted-foreground italic">
                          Nenhum texto foi extraído ou reconhecido na imagem.
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-lg font-medium">Informações da Redação</h2>
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
                    <Button variant="outline" onClick={() => setCaptureMode("preview")}>
                      Voltar
                    </Button>
                    <Button onClick={handleSubmitMetadata}>Analisar com IA</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {error && (
        <div className="absolute bottom-4 left-4 right-4 z-30">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}
