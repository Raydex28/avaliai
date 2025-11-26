"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useRef } from "react"

interface CompetencyData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string[]
    borderColor: string[]
    borderWidth: number
  }[]
}

interface CompetencyChartProps {
  title: string
  description?: string
  data: CompetencyData
}

export function CompetencyChart({ title, description, data }: CompetencyChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Importar Chart.js dinamicamente para evitar problemas de SSR
    const loadChart = async () => {
      try {
        const { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend } = await import(
          "chart.js"
        )

        // Registrar os componentes necessários
        Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend)

        // Destruir o gráfico anterior se existir
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy()
        }

        // Criar novo gráfico
        chartInstanceRef.current = new Chart(ctx, {
          type: "radar",
          data: {
            labels: data.labels,
            datasets: [
              {
                label: data.datasets[0].label,
                data: data.datasets[0].data,
                backgroundColor: ["rgba(234, 179, 8, 0.2)"], // Amarelo transparente
                borderColor: ["#eab308"], // Amarelo
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              r: {
                min: 0,
                max: 200,
                ticks: {
                  stepSize: 50,
                },
                pointLabels: {
                  font: {
                    size: 10,
                  },
                },
              },
            },
            plugins: {
              legend: {
                position: "top",
              },
              tooltip: {
                callbacks: {
                  label: (context) => `${context.dataset.label}: ${context.raw}/200`,
                },
              },
            },
          },
        })
      } catch (error) {
        console.error("Erro ao carregar Chart.js:", error)
      }
    }

    loadChart()

    return () => {
      // Limpar o gráfico quando o componente for desmontado
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [data])

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        {description && <CardDescription className="text-xs sm:text-sm">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[250px] sm:h-[300px]">
          <canvas ref={canvasRef} />
        </div>
      </CardContent>
    </Card>
  )
}
