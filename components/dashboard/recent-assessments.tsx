"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Assessment } from "@/types/assessment"

interface RecentAssessmentsProps {
  assessments: Assessment[]
}

export function RecentAssessments({ assessments }: RecentAssessmentsProps) {
  const router = useRouter()

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

  return (
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
                className="flex items-center justify-between p-3 sm:p-4 hover:bg-muted cursor-pointer"
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
  )
}
