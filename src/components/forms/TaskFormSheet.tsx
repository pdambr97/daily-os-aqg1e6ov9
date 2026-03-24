import React, { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useAppStore } from '@/store/AppContext'
import { Task, Area, Priority, Horizon } from '@/lib/types'
import { toast } from 'sonner'

export const TaskFormSheet = ({ children }: { children: React.ReactNode }) => {
  const { setState } = useAppStore()
  const [open, setOpen] = useState(false)

  const [text, setText] = useState('')
  const [area, setArea] = useState<Area>('work')
  const [priority, setPriority] = useState<Priority>('normal')
  const [horizon, setHorizon] = useState<Horizon>('today')
  const [dueDate, setDueDate] = useState('')
  const [xp, setXp] = useState('10')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text) return

    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      area,
      priority,
      horizon,
      dueDate: dueDate || undefined,
      xp: parseInt(xp) || 10,
      done: false,
      createdAt: new Date().toISOString(),
    }

    setState((s) => ({ ...s, tasks: [...s.tasks, newTask] }))
    toast.success('Tarefa criada!')
    setOpen(false)
    setText('')
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[85vh] rounded-t-xl bg-surface border-t border-border"
      >
        <SheetHeader className="mb-4">
          <SheetTitle>Nova Tarefa</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pb-8">
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="O que precisa ser feito?"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Área</Label>
              <Select value={area} onValueChange={(v: Area) => setArea(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Trabalho</SelectItem>
                  <SelectItem value="personal">Pessoal</SelectItem>
                  <SelectItem value="finance">Finanças</SelectItem>
                  <SelectItem value="health">Saúde</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select value={priority} onValueChange={(v: Priority) => setPriority(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgente</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Horizonte</Label>
              <Select value={horizon} onValueChange={(v: Horizon) => setHorizon(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Semana</SelectItem>
                  <SelectItem value="month">Mês</SelectItem>
                  <SelectItem value="quarter">Trimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>XP</Label>
              <Select value={xp} onValueChange={setXp}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 XP</SelectItem>
                  <SelectItem value="10">10 XP</SelectItem>
                  <SelectItem value="20">20 XP</SelectItem>
                  <SelectItem value="50">50 XP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Data Limite (Opcional)</Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-background"
            />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white mt-4">
            Criar Tarefa
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
