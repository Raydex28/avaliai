"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, CheckCircle, Clock } from "lucide-react"
import {
  extractTextFromFile,
  isSupportedDocumentType,
  validateExtractedText,
  type DocumentExtractionResult,
} from "@/services/document-service"

interface FileUploadProps {
  onTextExtracted: (text: string) => void
  onError: (error: string) => void
}

export function FileUpload({ onTextExtracted, onError }: FileUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [processingStatus, setProcessingStatus] = useState("")
  const [extractionResult, setExtractionResult] = useState<DocumentExtractionResult | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]

      if (!file) return

      // Verificar se o tipo de arquivo é suportado
      if (!isSupportedDocumentType(file)) {
        onError("Tipo de arquivo não suportado. Use DOCX, RTF ou TXT.")
        return
      }

      // Verificar tamanho do arquivo (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        onError("Arquivo muito grande. O tamanho máximo é 10MB.")
        return
      }

      setIsProcessing(true)
      setProgress(0)
      setProcessingStatus("Iniciando extração...")
      setExtractionResult(null)

      try {
        // Simular progresso durante a extração
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 90))
        }, 200)

        setProcessingStatus("Extraindo texto do documento...")

        const result = await extractTextFromFile(file)

        clearInterval(progressInterval)
        setProgress(100)

        if (!result.success) {
          throw new Error(result.error || "Falha na extração de texto")
        }

        setExtractionResult(result)

        // Validar o texto extraído
        const validation = validateExtractedText(result.text)

        if (!validation.isValid) {
          onError(`Problemas encontrados no texto: ${validation.issues.join(", ")}`)
          return
        }

        setProcessingStatus("Texto extraído com sucesso!")
        onTextExtracted(result.text)
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
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/rtf": [".rtf"],
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
                <p className="text-sm text-muted-foreground mt-1">Suportamos DOCX, RTF e TXT (máximo 10MB)</p>
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

          {extractionResult && extractionResult.success && (
            <Alert className="mt-4 border-green-200 bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-300">
                <div className="space-y-1">
                  <p>
                    <strong>Texto extraído com sucesso!</strong>
                  </p>
                  <div className="text-sm space-y-1">
                    <p>• {extractionResult.wordCount} palavras encontradas</p>
                    <p>• Tempo de processamento: {extractionResult.extractionTime}ms</p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="flex flex-col items-center space-y-2 p-3 border rounded-lg">
          <FileText className="h-8 w-8 text-blue-500" />
          <span className="text-sm font-medium">DOCX</span>
          <span className="text-xs text-muted-foreground">Word 2007+</span>
        </div>

        <div className="flex flex-col items-center space-y-2 p-3 border rounded-lg">
          <FileText className="h-8 w-8 text-purple-500" />
          <span className="text-sm font-medium">RTF</span>
          <span className="text-xs text-muted-foreground">Rich Text</span>
        </div>

        <div className="flex flex-col items-center space-y-2 p-3 border rounded-lg">
          <FileText className="h-8 w-8 text-gray-500" />
          <span className="text-sm font-medium">TXT</span>
          <span className="text-xs text-muted-foreground">Texto simples</span>
        </div>
      </div>
    </div>
  )
}
