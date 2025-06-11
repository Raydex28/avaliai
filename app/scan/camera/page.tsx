"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, RotateCcw, Download, ArrowLeft, Zap, Settings, CheckCircle, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useClass } from "@/contexts/class-context"
import { processOCR, preprocessImageForOCR, type OCRProgress, type OCRResult } from "@/services/ocr-service"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useToast } from "@/components/ui/use-toast"

export default function CameraPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { currentClass } = useClass()
  const { toast } = useToast()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrProgress, setOcrProgress] = useState<OCRProgress | null>(null)
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)

  // Verificar autenticação
  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  // Inicializar câmera
  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      setCameraError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: "environment", // Câmera traseira em dispositivos móveis
        },
      })

      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error("Erro ao acessar câmera:", error)
      setCameraError("Não foi possível acessar a câmera. Verifique as permissões.")
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")!

    // Definir dimensões do canvas
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Desenhar frame do vídeo no canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Pré-processar imagem para melhor OCR
    const processedImageUrl = preprocessImageForOCR(canvas)
    setCapturedImage(processedImageUrl)

    // Parar câmera após captura
    stopCamera()
  }, [stream])

  const retakePhoto = () => {
    setCapturedImage(null)
    setOcrResult(null)
    setOcrProgress(null)
    startCamera()
  }

  const processImage = async () => {
    if (!capturedImage) return

    setIsProcessing(true)
    setOcrProgress(null)
    setOcrResult(null)

    try {
      const result = await processOCR(capturedImage, (progress) => {
        setOcrProgress(progress)
      })

      setOcrResult(result)

      if (result.hasText && result.textQuality !== "insufficient") {
        toast({
          title: "Texto reconhecido!",
          description: `${result.wordCount} palavras detectadas com ${Math.round(result.confidence * 100)}% de confiança.`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Texto insuficiente",
          description: "Tente capturar uma imagem mais clara ou com melhor iluminação.",
        })
      }
    } catch (error) {
      console.error("Erro no processamento OCR:", error)
      toast({
        variant: "destructive",
        title: "Erro no processamento",
        description: "Não foi possível processar a imagem. Tente novamente.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const continueWithText = () => {
    if (!ocrResult?.text || !currentClass) return

    const params = new URLSearchParams({
      text: ocrResult.text,
      isValid: "true",
      reason: "",
      textType: "dissertativo-argumentativo",
      classId: currentClass.id,
      className: currentClass.name,
      source: "camera",
    })

    router.push(`/scan/metadata?${params.toString()}`)
  }

  const downloadImage = () => {
    if (!capturedImage) return

    const link = document.createElement("a")
    link.download = `redacao-${Date.now()}.png`
    link.href = capturedImage
    link.click()
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-xl font-bold">Escanear Redação</h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Área da Câmera/Imagem - Maior */}
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                {capturedImage ? "Imagem Capturada" : "Câmera"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                {cameraError ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                      <p className="text-red-600 dark:text-red-400">{cameraError}</p>
                      <Button onClick={startCamera} className="mt-4">
                        Tentar Novamente
                      </Button>
                    </div>
                  </div>
                ) : capturedImage ? (
                  <img
                    src={capturedImage || "/placeholder.svg"}
                    alt="Imagem capturada"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                )}

                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="flex gap-2 mt-4">
                {capturedImage ? (
                  <>
                    <Button onClick={retakePhoto} variant="outline" className="flex-1">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Nova Foto
                    </Button>
                    <Button onClick={downloadImage} variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button onClick={processImage} disabled={isProcessing} className="flex-1">
                      <Zap className="h-4 w-4 mr-2" />
                      {isProcessing ? "Processando..." : "Extrair Texto"}
                    </Button>
                  </>
                ) : (
                  <Button onClick={capturePhoto} disabled={!stream || cameraError !== null} className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    Capturar Foto
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Área de Resultados - Menor */}
          <Card className="xl:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Resultado do OCR
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isProcessing && ocrProgress && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>{ocrProgress.message}</span>
                    <span>{Math.round(ocrProgress.progress * 100)}%</span>
                  </div>
                  <Progress value={ocrProgress.progress * 100} />
                </div>
              )}

              {ocrResult && (
                <div className="space-y-4">
                  <Alert
                    className={
                      ocrResult.hasText
                        ? "border-green-200 bg-green-50 dark:bg-green-900/20"
                        : "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20"
                    }
                  >
                    {ocrResult.hasText ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium">
                          {ocrResult.hasText ? "Texto detectado!" : "Nenhum texto detectado"}
                        </p>
                        <div className="text-sm space-y-1">
                          {ocrResult.contentDescription?.map((desc, index) => (
                            <p key={index}>• {desc}</p>
                          ))}
                          {ocrResult.processingTime && <p>• Tempo de processamento: {ocrResult.processingTime}ms</p>}
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>

                  {ocrResult.hasText && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Texto Extraído:</h4>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg max-h-60 overflow-y-auto">
                          <p className="text-sm whitespace-pre-wrap">{ocrResult.text}</p>
                        </div>
                      </div>

                      {ocrResult.textQuality !== "insufficient" && (
                        <Button onClick={continueWithText} className="w-full">
                          Continuar com este Texto
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {!isProcessing && !ocrResult && (
                <div className="text-center text-muted-foreground py-8">
                  <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Capture uma foto para extrair o texto</p>
                  <p className="text-sm mt-2">Certifique-se de que o texto esteja bem iluminado e legível</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Dicas para melhor OCR */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Dicas para Melhor Reconhecimento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Boa Iluminação</p>
                  <p className="text-muted-foreground">Use luz natural ou artificial uniforme</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Texto Legível</p>
                  <p className="text-muted-foreground">Letra clara e bem formada</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Sem Sombras</p>
                  <p className="text-muted-foreground">Evite sombras sobre o texto</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Enquadramento</p>
                  <p className="text-muted-foreground">Mantenha o texto centralizado</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
