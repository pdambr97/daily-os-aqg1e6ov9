import React, { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppStore } from '@/store/AppContext'
import { Goal, Area } from '@/lib/types'
import { toast } from 'sonner'

export const GoalFormSheet = ({ children }: { children: React.ReactNode }) => {
  const { setState } = useAppStore()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [area, setArea] = useState<Area>('work')
  const [horizon, setHorizon] = useState<'semanal' | 'mensal' | 'anual'>('mensal')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return

    const newGoal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      area,
      horizon,
      progress: 0,
    }

    setState((s) => ({ ...s, goals: [...s.goals, newGoal] }))
    toast.success('Meta criada!', {
      style: { background: '#7c6fff', color: '#fff', border: 'none' },
    })
    setOpen(false)
    setTitle('')
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[70vh] rounded-t-xl bg-surface border-t border-border"
      >
        <SheetHeader className="mb-4">
          <SheetTitle>Nova Meta</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Aprender React"
              required
            />
          </div>

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
            <Label>Horizonte</Label>
            <Select value={horizon} onValueChange={(v: any) => setHorizon(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semanal">Semanal</SelectItem>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white mt-6">
            Criar Meta
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
