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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return

    const newHabit: Habit = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      emoji,
      color,
      history: {},
    }

    setState((s) => ({ ...s, habits: [...s.habits, newHabit] }))
    setOpen(false)
    setName('')
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[70vh] rounded-t-xl bg-surface border-t border-border"
      >
        <SheetHeader className="mb-4">
          <SheetTitle>Novo Hábito</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Beber 2L de água"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Emoji</Label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`w-10 h-10 rounded-md text-xl flex items-center justify-center ${emoji === e ? 'bg-muted ring-2 ring-primary' : ''}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-background' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white mt-4">
            Criar Hábito
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
