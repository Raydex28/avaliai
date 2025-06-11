"use client"

import { useClass } from "@/contexts/class-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'
import type { TimeFrame } from "@/types/class"

export function TimeFrameSelector() {
  const { currentClass, selectedTimeFrame, setSelectedTimeFrame } = useClass()

  // Determinar as opções de período com base na turma atual
  const timeFrameOptions: TimeFrame[] = currentClass?.period === "Bimestre"
    ? ["1º Bimestre", "2º Bimestre", "3º Bimestre", "4º Bimestre"]
    : ["1º Semestre", "2º Semestre"]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {selectedTimeFrame}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {timeFrameOptions.map((timeFrame) => (
          <DropdownMenuItem
            key={timeFrame}
            onClick={() => setSelectedTimeFrame(timeFrame)}
            className="cursor-pointer"
          >
            {timeFrame}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
