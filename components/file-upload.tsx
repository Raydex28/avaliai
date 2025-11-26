"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, CheckCircle, Clock } from "lucide-react"

interface FileUploadProps {
  onTextExtracted: (text: string) => void
  onError: (error: string) => void
}

async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === "text/plain") {
    return await file.text()
  }

  // Para outros formatos, simular extração
  return (
    "Texto extraído do documento: " +
    file.name +
    "\n\nEste é um texto de exemplo simulado para demonstração da funcionalidade."
  )
}

export function FileUpload({ onTextExtracted, onError }: FileUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [processingStatus, setProcessingStatus] = useState("")
  const [wordCount, setWordCount] = useState(0)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      // Verificar tamanho do arquivo
      if (file.size > 10 * 1024 * 1024) {
        onError("Arquivo muito grande. O tamanho máximo é 10MB.")
        return
      }

      setIsProcessing(true)
      setProgress(0)
      setProcessingStatus("Iniciando extração...")

      try {
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 90))
        }, 200)

        setProcessingStatus("Extraindo texto do documento...")
        const text = await extractTextFromFile(file)

        clearInterval(progressInterval)
        setProgress(100)

        const words = text.trim().split(/\s+/).length
        setWordCount(words)

        if (words < 10) {
          onError("Texto muito curto. Mínimo de 10 palavras.")
          return
        }

        setProcessingStatus("Texto extraído com sucesso!")
        onTextExtracted(text)
      } catch (error) {
        console.error("Erro ao processar arquivo:", error)
        onError(error instanceof Error ? error.message : "Erro ao processar arquivo")
      } finally {
        setIsProcessing(false)
        setTimeout(() => {
          setProgress(0)
          setProcessingStatus("")
        }, 3000)
      }
    },
    [onTextExtracted, onError],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    disabled: isProcessing,
  })

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-600"}
              ${isProcessing ? "opacity-50 cursor-not-allowed" : "hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"}
            `}
          >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center space-y-4">
              {isProcessing ? (
                <Clock className="h-12 w-12 text-blue-500 animate-spin" />
              ) : (
                <Upload className="h-12 w-12 text-gray-400" />
              )}

              <div>
                <p className="text-lg font-medium">
                  {isProcessing ? "Processando arquivo..." : "Arraste um arquivo aqui ou clique para selecionar"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Suportamos TXT (máximo 10MB)</p>
              </div>
            </div>
          </div>

          {isProcessing && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{processingStatus}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {wordCount > 0 && !isProcessing && (
            <Alert className="mt-4 border-green-200 bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-300">
                <p>
                  <strong>Texto extraído com sucesso!</strong>
                </p>
                <p className="text-sm mt-1">• {wordCount} palavras encontradas</p>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 text-center">
        <div className="flex flex-col items-center space-y-2 p-3 border rounded-lg">
          <FileText className="h-8 w-8 text-gray-500" />
          <span className="text-sm font-medium">TXT</span>
          <span className="text-xs text-muted-foreground">Texto simples</span>
        </div>
      </div>
    </div>
  )
}
