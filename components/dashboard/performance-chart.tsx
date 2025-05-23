"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useRef } from "react"

interface PerformanceData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor: string
    backgroundColor: string
  }[]
}

interface PerformanceChartProps {
  title: string
  description?: string
  data: PerformanceData
}

export function PerformanceChart({ title, description, data }: PerformanceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Importar Chart.js dinamicamente para evitar problemas de SSR
    const loadChart = async () => {
      try {
        const { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } =
          await import("chart.js")

        // Registrar os componentes necessários
        Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend)

        // Destruir o gráfico anterior se existir
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy()
        }

        // Criar novo gráfico
        chartInstanceRef.current = new Chart(ctx, {
          type: "line",
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
              },
              tooltip: {
                mode: "index",
                intersect: false,
              },
            },
            scales: {
              y: {
                min: 0,
                max: 1000,
                ticks: {
                  stepSize: 200,
                },
              },
            },
            interaction: {
              mode: "nearest",
              axis: "x",
              intersect: false,
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
    <Card className="col-span-3">
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
