import { PenTool } from "lucide-react"

interface TeacherIconProps {
  className?: string
  size?: number
}

export function TeacherIcon({ className, size = 24 }: TeacherIconProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute -top-1 -right-1 bg-yellow-200 rounded-full w-4 h-4 animate-pulse"></div>
      <div className="relative bg-blue-100 text-blue-600 p-2 rounded-full">
        <PenTool size={size} />
      </div>
    </div>
  )
}
