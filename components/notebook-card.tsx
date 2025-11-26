import type React from "react"
import { cn } from "@/lib/utils"

interface NotebookCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  highlight?: boolean
  darkMode?: boolean
}

export function NotebookCard({ children, className, highlight, darkMode, ...props }: NotebookCardProps) {
  return (
    <div
      className={cn(
        "relative p-6 rounded-lg border shadow-md overflow-hidden",
        highlight ? "bg-white dark:bg-slate-800" : "bg-blue-50/70 dark:bg-slate-800/70",
        darkMode ? "bg-slate-800 border-slate-700 notebook-line-dark text-white" : "notebook-line dark:text-white",
        darkMode ? "text-white" : "text-foreground",
        className,
      )}
      style={{
        backgroundImage: darkMode
          ? "url('/images/notebook-texture.png'), linear-gradient(transparent 0%, transparent calc(100% - 1px), #334155 calc(100% - 1px), #334155 100%)"
          : "url('/images/notebook-texture.png'), linear-gradient(transparent 0%, transparent calc(100% - 1px), #e5e7eb calc(100% - 1px), #e5e7eb 100%)",
        backgroundSize: "cover, 100% 2rem",
        backgroundBlendMode: "overlay, normal",
      }}
      {...props}
    >
      {highlight && (
        <div className="absolute top-0 right-0">
          <div className="w-16 h-16 bg-yellow-400 dark:bg-yellow-600 rotate-45 transform translate-x-8 -translate-y-8"></div>
        </div>
      )}
      <div className="relative z-10">{children}</div>
      <div className="absolute top-2 right-2">
        <img
          src="/images/paper-clip.png"
          alt="Paper Clip"
          className="w-8 h-8 object-contain opacity-70"
          onError={(e) => {
            e.currentTarget.style.display = "none"
          }}
        />
      </div>
    </div>
  )
}
