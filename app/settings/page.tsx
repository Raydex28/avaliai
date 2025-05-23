"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Save, Info } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [competencies, setCompetencies] = useState([
    {
      name: "Competência 1 - Domínio da norma padrão",
      points: 200,
      description: "Demonstrar domínio da modalidade escrita formal da língua portuguesa.",
    },
    {
      name: "Competência 2 - Compreensão da proposta",
      points: 200,
      description:
        "Compreender a proposta de redação e aplicar conceitos das várias áreas de conhecimento para desenvolver o tema, dentro dos limites estruturais do texto dissertativo-argumentativo em prosa.",
    },
    {
      name: "Competência 3 - Argumentação",
      points: 200,
      description:
        "Selecionar, relacionar, organizar e interpretar informações, fatos, opiniões e argumentos em defesa de um ponto de vista.",
    },
    {
      name: "Competência 4 - Coesão textual",
      points: 200,
      description: "Demonstrar conhecimento dos mecanismos linguísticos necessários para a construção da argumentação.",
    },
    {
      name: "Competência 5 - Proposta de intervenção",
      points: 200,
      description: "Elaborar proposta de intervenção para o problema abordado, respeitando os direitos humanos.",
    },
  ])

  const [totalPoints, setTotalPoints] = useState(1000)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // Calcular o total de pontos
    const total = competencies.reduce((sum, comp) => sum + comp.points, 0)
    setTotalPoints(total)
  }, [competencies])

  const handlePointsChange = (index: number, value: number) => {
    if (!isEditing) return

    const updatedCompetencies = [...competencies]
    updatedCompetencies[index].points = value

    // Recalcular o total
    setCompetencies(updatedCompetencies)
  }

  const resetToDefault = () => {
    setCompetencies([
      {
        name: "Competência 1 - Domínio da norma padrão",
        points: 200,
        description: "Demonstrar domínio da modalidade escrita formal da língua portuguesa.",
      },
      {
        name: "Competência 2 - Compreensão da proposta",
        points: 200,
        description:
          "Compreender a proposta de redação e aplicar conceitos das várias áreas de conhecimento para desenvolver o tema, dentro dos limites estruturais do texto dissertativo-argumentativo em prosa.",
      },
      {
        name: "Competência 3 - Argumentação",
        points: 200,
        description:
          "Selecionar, relacionar, organizar e interpretar informações, fatos, opiniões e argumentos em defesa de um ponto de vista.",
      },
      {
        name: "Competência 4 - Coesão textual",
        points: 200,
        description:
          "Demonstrar conhecimento dos mecanismos linguísticos necessários para a construção da argumentação.",
      },
      {
        name: "Competência 5 - Proposta de intervenção",
        points: 200,
        description: "Elaborar proposta de intervenção para o problema abordado, respeitando os direitos humanos.",
      },
    ])
    setIsEditing(false)
  }

  const saveSettings = () => {
    // Verificar se o total é 1000
    if (totalPoints !== 1000) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "O total de pontos deve ser exatamente 1000.",
      })
      return
    }

    // Em uma implementação real, isso salvaria os critérios no armazenamento
    toast({
      title: "Configurações salvas",
      description: "As competências foram atualizadas com sucesso.",
    })
    setIsEditing(false)
    router.push("/")
  }

  return (
    <DashboardLayout>
      <div className="flex items-center mb-4">
        <h1 className="text-xl font-bold">Competências de Avaliação</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Competências da Redação ENEM</CardTitle>
              <CardDescription>Configuração dos pontos para cada competência</CardDescription>
            </div>
            <Button variant={isEditing ? "default" : "outline"} onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancelar Edição" : "Editar Pontos"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isEditing && (
            <Alert className="mb-4">
              <AlertDescription>
                As competências seguem o modelo oficial do ENEM. Cada competência vale até 200 pontos, totalizando 1000
                pontos.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Total de Pontos:</span>
            <span className={`font-bold text-lg ${totalPoints !== 1000 ? "text-red-500" : "text-green-600"}`}>
              {totalPoints}/1000
            </span>
          </div>

          <TooltipProvider>
            {competencies.map((competency, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Label>{competency.name}</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p>{competency.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">{competency.points} pontos</span>
                  </div>
                </div>
                {isEditing ? (
                  <Slider
                    value={[competency.points]}
                    min={100}
                    max={300}
                    step={20}
                    onValueChange={(value) => handlePointsChange(index, value[0])}
                    disabled={!isEditing}
                  />
                ) : (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full bg-blue-600"
                      style={{ width: `${(competency.points / 300) * 100}%` }}
                    ></div>
                  </div>
                )}
                {index < competencies.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </TooltipProvider>
        </CardContent>
        <CardFooter className="flex justify-between">
          {isEditing && (
            <Button variant="outline" onClick={resetToDefault}>
              Restaurar Padrão
            </Button>
          )}
          {isEditing && (
            <Button
              className={totalPoints !== 1000 ? "bg-red-600 hover:bg-red-700" : ""}
              onClick={saveSettings}
              disabled={totalPoints !== 1000}
            >
              <Save className="h-4 w-4 mr-2" /> Salvar Competências
            </Button>
          )}
        </CardFooter>
      </Card>
    </DashboardLayout>
  )
}
