"use client"

import { Button } from "@/components/ui/button"
import { useDeviceType } from "@/hooks/use-device-type"
import { Laptop, Smartphone } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ViewToggle() {
  const { deviceType, setDeviceType } = useDeviceType()

  const toggleView = () => {
    setDeviceType(deviceType === "mobile" ? "desktop" : "mobile")
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={toggleView} className="h-8 w-8">
            {deviceType === "mobile" ? <Laptop className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
            <span className="sr-only">
              {deviceType === "mobile" ? "Alternar para visualização desktop" : "Alternar para visualização mobile"}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {deviceType === "mobile" ? "Alternar para visualização desktop" : "Alternar para visualização mobile"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
