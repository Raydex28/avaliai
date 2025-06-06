"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { getClasses, getClass } from "@/services/class-service"
import type { Class, TimeFrame } from "@/types/class"

interface ClassContextType {
  classes: Class[]
  currentClass: Class | null
  selectedTimeFrame: TimeFrame
  isLoading: boolean
  error: string | null
  setCurrentClass: (classId: string) => void
  setSelectedTimeFrame: (timeFrame: TimeFrame) => void
}

const ClassContext = createContext<ClassContextType | undefined>(undefined)

export function ClassProvider({ children }: { children: React.ReactNode }) {
  const [classes, setClasses] = useState<Class[]>([])
  const [currentClass, setCurrentClassState] = useState<Class | null>(null)
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>("1º Semestre")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadClasses() {
      try {
        setIsLoading(true)
        const data = await getClasses()
        setClasses(data)
        
        // Definir a primeira turma como atual se não houver nenhuma selecionada
        if (data.length > 0 && !currentClass) {
          const firstClass = await getClass(data[0].id)
          setCurrentClassState(firstClass)
        }
        
        setIsLoading(false)
      } catch (err) {
        setError("Erro ao carregar turmas")
        setIsLoading(false)
      }
    }
    
    loadClasses()
  }, [])

  const setCurrentClass = async (classId: string) => {
    try {
      setIsLoading(true)
      const classData = await getClass(classId)
      setCurrentClassState(classData)
      
      // Ajustar o período selecionado com base na turma
      if (classData?.period === "Semestre") {
        setSelectedTimeFrame(classData.semester === 1 ? "1º Semestre" : "2º Semestre")
      } else {
        setSelectedTimeFrame("1º Bimestre")
      }
      
      setIsLoading(false)
    } catch (err) {
      setError("Erro ao carregar turma")
      setIsLoading(false)
    }
  }

  return (
    <ClassContext.Provider
      value={{
        classes,
        currentClass,
        selectedTimeFrame,
        isLoading,
        error,
        setCurrentClass,
        setSelectedTimeFrame,
      }}
    >
      {children}
    </ClassContext.Provider>
  )
}

export function useClass() {
  const context = useContext(ClassContext)
  if (context === undefined) {
    throw new Error("useClass must be used within a ClassProvider")
  }
  return context
}
