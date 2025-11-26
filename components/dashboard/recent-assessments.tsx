"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronRight, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Assessment } from "@/types/assessment"
import { useState } from "react"
import { deleteAssessment } from "@/services/assessment-service"
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
import { Button } from "@/components/ui/button"

interface RecentAssessmentsProps {
  assessments: Assessment[]
  onAssessmentDeleted?: () => void
}

export function RecentAssessments({ assessments, onAssessmentDeleted }: RecentAssessmentsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  const [assessmentToDelete, setAssessmentToDelete] = useState<Assessment | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 800) return "bg-green-100 text-green-800"
    if (grade >= 600) return "bg-blue-100 text-blue-800"
    if (grade >= 400) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
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
      if (onAssessmentDeleted) {
        onAssessmentDeleted()
      }
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
    <>
      <Card className="col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg">Avaliações Recentes</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Últimas redações avaliadas</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {assessments.length > 0 ? (
              assessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="flex items-center justify-between p-3 sm:p-4 hover:bg-muted cursor-pointer group"
                  onClick={() => router.push(`/results?id=${assessment.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm sm:text-base truncate">{assessment.studentName}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Redação ENEM</div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Badge className={getGradeColor(assessment.grade)}>{assessment.grade}</Badge>
                    <div className="hidden sm:flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(assessment.createdAt)}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                      onClick={(e) => handleDeleteClick(e, assessment)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs sm:text-sm text-muted-foreground">
                Nenhuma avaliação recente encontrada
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
    </>
  )
}
