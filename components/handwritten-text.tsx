import type React from "react"
import { cn } from "@/lib/utils"

interface HandwrittenTextProps {
  children: React.ReactNode
  className?: string
  color?: "blue" | "green" | "red" | "purple" | "yellow" | "default"
}

export function HandwrittenText({ children, className, color = "default" }: HandwrittenTextProps) {
  const colorClasses = {
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400",
    red: "text-red-600 dark:text-red-400",
    purple: "text-purple-600 dark:text-purple-400",
    yellow: "text-yellow-600 dark:text-yellow-400",
    default: "text-foreground",
  }

  return <span className={cn("handwritten", colorClasses[color], className)}>{children}</span>
}
