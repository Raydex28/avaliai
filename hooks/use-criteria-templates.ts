"use client"

import { useState, useEffect } from "react"
import { getCriteriaTemplates } from "@/services/criteria-service"
import type { CriteriaTemplate } from "@/types/criteria"

export function useCriteriaTemplates() {
  const [templates, setTemplates] = useState<CriteriaTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getCriteriaTemplates()
        setTemplates(data)
        setError(null)
      } catch (err) {
        setError("Falha ao carregar modelos de critérios")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  return { templates, isLoading, error }
}
