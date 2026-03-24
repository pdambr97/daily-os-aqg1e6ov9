import React, { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppStore } from '@/store/AppContext'
import { Habit } from '@/lib/types'

const EMOJIS = [
  '💧',
  '🧘',
  '📚',
  '🏃',
  '🥗',
  '💊',
  '🛌',
  '💻',
  '📱',
  '📓',
  '💸',
  '🧠',
  '☀️',
  '🎨',
  '🎧',
]
const COLORS = ['#10b981', '#7c6fff', '#f0c040', '#ff5c5c', '#3b82f6', '#ec4899', '#8b5cf6']

export const HabitFormSheet = ({ children }: { children: React.ReactNode }) => {
  const { setState } = useAppStore()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState(EMOJIS[0])
  const [color, setColor] = useState(COLORS[0])
  const [frequencyPerWeek, setFrequencyPerWeek] = useState(7)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return

    const newHabit: Habit = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      emoji,
      color,
      frequencyPerWeek,
      history: {},
    }

    setState((s) => ({ ...s, habits: [...s.habits, newHabit] }))
    setOpen(false)
    setName('')
    setFrequencyPerWeek(7)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[85vh] rounded-t-2xl bg-surface border-t border-border overflow-y-auto flex flex-col"
      >
        <SheetHeader className="mb-6 shrink-0 pt-2">
          <SheetTitle className="text-2xl">Novo Hábito</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-8 flex-1 pb-8">
          <div className="space-y-3">
            <Label className="text-muted-foreground">Nome do Hábito</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Beber 2L de água"
              className="h-12 bg-background border-border text-lg"
              required
            />
          </div>

          <div className="space-y-3">
            <Label className="text-muted-foreground">Freqüência semanal</Label>
            <div className="flex justify-between bg-background p-1.5 rounded-xl border border-border">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setFrequencyPerWeek(num)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold transition-all ${frequencyPerWeek === num ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'}`}
                >
                  {num}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {frequencyPerWeek} {frequencyPerWeek === 1 ? 'vez' : 'vezes'} por semana
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-muted-foreground">Ícone</Label>
            <div className="flex flex-wrap gap-3">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all bg-background border ${emoji === e ? 'border-primary bg-primary/10 shadow-sm' : 'border-border hover:border-muted-foreground/30'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-muted-foreground">Cor de destaque</Label>
            <div className="flex gap-3 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-full transition-all ${color === c ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface scale-110' : 'hover:scale-105'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-white mt-8 rounded-xl shadow-lg shadow-primary/20"
          >
            Criar Hábito
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
