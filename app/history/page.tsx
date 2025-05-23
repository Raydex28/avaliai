"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, ChevronRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function HistoryPage() {
  const router = useRouter()

  // Isso viria do backend em uma implementação real
  const assessmentHistory = [
    { id: 1, student: "Maria Silva", grade: 920, date: "2023-03-15" },
    { id: 2, student: "João Santos", grade: 780, date: "2023-03-14" },
    { id: 3, student: "Ana Oliveira", grade: 850, date: "2023-03-14" },
    { id: 4, student: "Carlos Pereira", grade: 900, date: "2023-03-13" },
    { id: 5, student: "Beatriz Costa", grade: 880, date: "2023-03-12" },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <h1 className="text-xl font-bold">Histórico de Redações</h1>
        </div>

        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome do aluno" className="pl-8" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Redações Avaliadas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {assessmentHistory.map((assessment, index) => (
                <div
                  key={assessment.id}
                  className="flex items-center justify-between p-4 hover:bg-muted cursor-pointer"
                  onClick={() => router.push(`/results?id=${assessment.id}`)}
                >
                  <div className="flex-1">
                    <div className="font-medium">{assessment.student}</div>
                    <div className="text-sm text-muted-foreground">Redação ENEM</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">{assessment.grade}</div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(assessment.date)}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
