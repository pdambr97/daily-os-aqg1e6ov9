import { useAppStore } from '@/store/AppContext'
import { HabitFormSheet } from '@/components/forms/HabitFormSheet'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { SwipeableRow } from '@/components/SwipeableRow'

export default function Habitos() {
  const { state, setState } = useAppStore()
  const todayStr = new Date().toISOString().split('T')[0]

  const habitsToday = state.habits.filter((h) => h.history[todayStr]).length
  const percent = state.habits.length ? Math.round((habitsToday / state.habits.length) * 100) : 0

  const handleToggle = (id: string, currentlyDone: boolean) => {
    setState((s) => ({
      ...s,
      habits: s.habits.map((h) =>
        h.id === id
          ? {
              ...h,
              history: { ...h.history, [todayStr]: !currentlyDone },
            }
          : h,
      ),
    }))
    if (!currentlyDone) {
      toast.success('Hábito concluído!', {
        style: { background: '#10b981', color: '#fff', border: 'none' },
      })
    }
  }

  const handleDelete = (id: string) => {
    setState((s) => ({ ...s, habits: s.habits.filter((h) => h.id !== id) }))
  }

  // Generate last 7 days strings
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col items-center justify-center p-6 bg-surface border border-border rounded-xl">
        <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-4 border-muted">
          <div
            className="absolute inset-0 rounded-full border-4 border-success transition-all duration-500"
            style={{ clipPath: `polygon(0 0, 100% 0, 100% ${percent}%, 0 ${percent}%)` }}
          />
          <span className="text-2xl font-bold z-10">{percent}%</span>
        </div>
        <p className="mt-3 text-sm font-medium text-muted-foreground">
          {percent === 100 ? 'Dia perfeito! 🏆' : 'Progresso de Hoje'}
        </p>
      </div>

      <div className="space-y-3">
        {state.habits.map((habit) => {
          const isDone = !!habit.history[todayStr]

          return (
            <SwipeableRow key={habit.id} onDelete={() => handleDelete(habit.id)}>
              <div className="flex flex-col p-4 bg-surface border border-border rounded-md">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{habit.emoji}</span>
                    <span className="font-bold">{habit.name}</span>
                  </div>
                  <Switch checked={isDone} onCheckedChange={() => handleToggle(habit.id, isDone)} />
                </div>
                <div className="flex justify-between items-center px-1">
                  <div className="flex gap-1.5">
                    {last7Days.map((date) => (
                      <div
                        key={date}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: habit.history[date] ? habit.color : '#27272a' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </SwipeableRow>
          )
        })}
        {state.habits.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">Nenhum hábito rastreado.</div>
        )}
      </div>

      <HabitFormSheet>
        <Button className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-elevation bg-normal hover:bg-normal/90 text-white z-50">
          <Plus size={24} />
        </Button>
      </HabitFormSheet>
    </div>
  )
}
