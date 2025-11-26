"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { getClasses, getClass, deleteClass } from "@/services/class-service"
import type { Class, TimeFrame } from "@/types/class"
import { useAuth } from "@/contexts/auth-context"

interface ClassContextType {
  classes: Class[]
  currentClass: Class | null
  selectedTimeFrame: TimeFrame
  isLoading: boolean
  error: string | null
  setCurrentClass: (classId: string) => void
  setSelectedTimeFrame: (timeFrame: TimeFrame) => void
  refreshClasses: () => Promise<void>
  deleteClass: (classId: string) => Promise<void>
}

const ClassContext = createContext<ClassContextType | undefined>(undefined)

export function ClassProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [classes, setClasses] = useState<Class[]>([])
  const [currentClass, setCurrentClassState] = useState<Class | null>(null)
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>("1º Semestre")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoadingClasses, setIsLoadingClasses] = useState(false)

  const loadClasses = useCallback(async () => {
    if (!user?.id) return
    if (isLoadingClasses) return // Prevent multiple simultaneous calls

    try {
      setIsLoadingClasses(true)
      setIsLoading(true)
      setError(null)
      
      const data = await getClasses()
      setClasses(data)

      if (data.length > 0 && !currentClass) {
        const firstClass = await getClass(data[0].id)
        setCurrentClassState(firstClass)
      }
    } catch (err) {
      console.error("Erro ao carregar turmas:", err)
      setError("Erro ao carregar turmas")
    } finally {
      setIsLoading(false)
      setIsLoadingClasses(false)
    }
  }, [user?.id, isLoadingClasses, currentClass])

  useEffect(() => {
    loadClasses()
  }, [user?.id]) // Only depend on user?.id, not the entire loadClasses function

  const setCurrentClass = async (classId: string) => {
    try {
      setIsLoading(true)
      const classData = await getClass(classId)
      setCurrentClassState(classData)

      if (classData?.period === "Semestre") {
        setSelectedTimeFrame(classData.semester === 1 ? "1º Semestre" : "2º Semestre")
      } else {
        setSelectedTimeFrame("1º Bimestre")
      }
    } catch (err) {
      setError("Erro ao carregar turma")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteClass = async (classId: string) => {
    try {
      setIsLoading(true)
      await deleteClass(classId)
      
      const updatedClasses = classes.filter(c => c.id !== classId)
      setClasses(updatedClasses)
      
      if (currentClass?.id === classId) {
        if (updatedClasses.length > 0) {
          setCurrentClass(updatedClasses[0].id)
        } else {
          setCurrentClassState(null)
        }
      }
    } catch (err) {
      console.error("Erro ao excluir turma:", err)
      setError("Erro ao excluir turma")
      throw err
    } finally {
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
        refreshClasses: loadClasses,
        deleteClass: handleDeleteClass,
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
