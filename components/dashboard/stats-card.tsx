import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function StatsCard({ title, value, description, icon, trend }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-1 sm:pb-2 flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">{title}</CardTitle>
          <CardDescription className="text-lg sm:text-2xl font-bold">{value}</CardDescription>
        </div>
        {icon && <div className="text-blue-600">{icon}</div>}
      </CardHeader>
      {(description || trend) && (
        <CardContent>
          <div className="text-xs text-muted-foreground">
            {trend && (
              <span className={trend.isPositive ? "text-green-600" : "text-red-600"}>
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%{" "}
              </span>
            )}
            {description}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
