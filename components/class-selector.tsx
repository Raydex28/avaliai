"use client"

import type React from "react"

import { useState } from "react"
import { useClass } from "@/contexts/class-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Plus, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClass } from "@/services/class-service"
import { useToast } from "@/components/ui/use-toast"

export function ClassSelector() {
  const { classes, currentClass, setCurrentClass, deleteClass, refreshClasses } = useClass()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    period: "Semestre",
    year: new Date().getFullYear(),
    semester: 1,
    students: 0,
  })
  const { toast } = useToast()

  const handleCreateClass = async () => {
    try {
      const newClass = await createClass(formData)
      await refreshClasses()
      setCurrentClass(newClass.id)
      toast({
        title: "Turma criada",
        description: `A turma ${newClass.name} foi criada com sucesso.`,
      })
      setOpen(false)
      setFormData({
        name: "",
        period: "Semestre",
        year: new Date().getFullYear(),
        semester: 1,
        students: 0,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar a turma.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteClass = async (e: React.MouseEvent, classId: string, className: string) => {
    e.stopPropagation() // Prevent dropdown item click
    if (confirm(`Tem certeza que deseja excluir a turma "${className}"?`)) {
      try {
        await deleteClass(classId)
        toast({
          title: "Turma excluída",
          description: `A turma ${className} foi excluída com sucesso.`,
        })
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível excluir a turma.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            {currentClass ? currentClass.name : "Selecionar Turma"}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {classes.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground text-center">Nenhuma turma encontrada</div>
          ) : (
            classes.map((classItem) => (
              <div key={classItem.id} className="flex items-center justify-between group">
                <DropdownMenuItem onClick={() => setCurrentClass(classItem.id)} className="cursor-pointer flex-1">
                  {classItem.name}
                </DropdownMenuItem>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 mr-1"
                  onClick={(e) => handleDeleteClass(e, classItem.id, classItem.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="icon" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Nova Turma</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome da Turma</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: 3º Ano A - Ensino Médio"
              />
            </div>
            <div className="grid gap-2">
              <Label>Período de Avaliação</Label>
              <RadioGroup
                value={formData.period}
                onValueChange={(value) => setFormData({ ...formData, period: value })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Semestre" id="semestre" />
                  <Label htmlFor="semestre">Semestral</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Bimestre" id="bimestre" />
                  <Label htmlFor="bimestre">Bimestral</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="year">Ano</Label>
                <Select
                  value={formData.year.toString()}
                  onValueChange={(value) => setFormData({ ...formData, year: Number.parseInt(value) })}
                >
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="semester">Semestre Atual</Label>
                <Select
                  value={formData.semester.toString()}
                  onValueChange={(value) => setFormData({ ...formData, semester: Number.parseInt(value) as 1 | 2 })}
                >
                  <SelectTrigger id="semester">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1º Semestre</SelectItem>
                    <SelectItem value="2">2º Semestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="students">Número de Alunos</Label>
              <Input
                id="students"
                type="number"
                value={formData.students}
                onChange={(e) => setFormData({ ...formData, students: Number.parseInt(e.target.value) || 0 })}
                placeholder="Ex: 30"
              />
            </div>
          </div>
          <Button onClick={handleCreateClass}>Criar Turma</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
