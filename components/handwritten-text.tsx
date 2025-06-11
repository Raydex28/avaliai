import type React from "react"
import { cn } from "@/lib/utils"

interface HandwrittenTextProps {
  children: React.ReactNode
  className?: string
  color?: "yellow" | "green" | "red" | "purple" | "amber" | "default"
  size?: "sm" | "base" | "lg" | "xl" | "2xl"
}

export function HandwrittenText({ children, className, color = "default", size = "base" }: HandwrittenTextProps) {
  const colorClasses = {
    yellow: "text-yellow-600 dark:text-yellow-400",
    green: "text-green-600 dark:text-green-400",
    red: "text-red-600 dark:text-red-400",
    purple: "text-purple-600 dark:text-purple-400",
    amber: "text-amber-600 dark:text-amber-400",
    default: "text-foreground",
  }

  const sizeClasses = {
    sm: "handwritten-sm",
    base: "handwritten",
    lg: "handwritten-lg",
    xl: "handwritten-xl",
    "2xl": "handwritten-2xl",
  }

  return <span className={cn(sizeClasses[size], colorClasses[color], className)}>{children}</span>
}
