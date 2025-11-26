"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, ChevronRight, Search, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ClassSelector } from "@/components/class-selector"
import { TimeFrameSelector } from "@/components/time-frame-selector"
import { useClass } from "@/contexts/class-context"
import { useState, useEffect } from "react"
import { getAssessments, deleteAssessment } from "@/services/assessment-service"
import type { Assessment } from "@/types/assessment"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function HistoryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { currentClass, selectedTimeFrame } = useClass()
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [assessmentToDelete, setAssessmentToDelete] = useState<Assessment | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchAssessments = async () => {
    setIsLoading(true)
    try {
      let data = await getAssessments()

      // Histórico agora mostra todas as redações do usuário

      // Filtrar por período
      // Em uma implementação real, você filtraria por período no backend
      // Aqui estamos simulando o filtro
      const now = new Date()
      const currentYear = now.getFullYear()

      let startDate: Date, endDate: Date

      switch (selectedTimeFrame) {
        case "1º Bimestre":
          startDate = new Date(currentYear, 0, 1)
          endDate = new Date(currentYear, 2, 31)
          break
        case "2º Bimestre":
          startDate = new Date(currentYear, 3, 1)
          endDate = new Date(currentYear, 5, 30)
          break
        case "3º Bimestre":
          startDate = new Date(currentYear, 6, 1)
          endDate = new Date(currentYear, 8, 30)
          break
        case "4º Bimestre":
          startDate = new Date(currentYear, 9, 1)
          endDate = new Date(currentYear, 11, 31)
          break
        case "1º Semestre":
          startDate = new Date(currentYear, 0, 1)
          endDate = new Date(currentYear, 5, 30)
          break
        case "2º Semestre":
          startDate = new Date(currentYear, 6, 1)
          endDate = new Date(currentYear, 11, 31)
          break
        default:
          startDate = new Date(currentYear, 0, 1)
          endDate = new Date(currentYear, 11, 31)
      }

      data = data.filter((assessment) => {
        const assessmentDate = new Date(assessment.createdAt)
        return assessmentDate >= startDate && assessmentDate <= endDate
      })

      setAssessments(data)
      setFilteredAssessments(data)
    } catch (error) {
      console.error("Erro ao buscar avaliações:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as avaliações. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAssessments()
  }, [currentClass, selectedTimeFrame])

  // Filtrar por nome do aluno quando o usuário digita na busca
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredAssessments(assessments)
    } else {
      const filtered = assessments.filter((assessment) =>
        assessment.studentName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredAssessments(filtered)
    }
  }, [searchQuery, assessments])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const handleDeleteClick = (e: React.MouseEvent, assessment: Assessment) => {
    e.stopPropagation()
    setAssessmentToDelete(assessment)
  }

  const confirmDelete = async () => {
    if (!assessmentToDelete) return

    setIsDeleting(true)
    try {
      await deleteAssessment(assessmentToDelete.id)
      toast({
        title: "Redação excluída",
        description: "A redação foi excluída com sucesso.",
        variant: "default",
      })
      fetchAssessments()
    } catch (error) {
      console.error("Erro ao excluir redação:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a redação. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setAssessmentToDelete(null)
    }
  }

  const cancelDelete = () => {
    setAssessmentToDelete(null)
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-xl font-bold">Histórico de Redações</h1>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <ClassSelector />
            <TimeFrameSelector />
          </div>
        </div>

        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome do aluno"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Redações Avaliadas
              {currentClass && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  {currentClass.name} - {selectedTimeFrame}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredAssessments.length > 0 ? (
              <div className="divide-y">
                {filteredAssessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="flex items-center justify-between p-4 hover:bg-muted cursor-pointer group"
                    onClick={() => router.push(`/results?id=${assessment.id}`)}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{assessment.studentName}</div>
                      <div className="text-sm text-muted-foreground">Redação ENEM</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">{assessment.grade}</div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(assessment.createdAt)}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                        onClick={(e) => handleDeleteClick(e, assessment)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                Nenhuma redação encontrada para os filtros selecionados.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!assessmentToDelete} onOpenChange={(open) => !open && cancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir redação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a redação de {assessmentToDelete?.studentName}? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting} className="bg-red-500 hover:bg-red-600">
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
