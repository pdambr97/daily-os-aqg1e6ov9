import { useAppStore } from '@/store/AppContext'
import { HabitFormSheet } from '@/components/forms/HabitFormSheet'
import { Button } from '@/components/ui/button'
import { Plus, Flame } from 'lucide-react'
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
    <div className="space-y-6 animate-fade-in pb-24">
      <div className="flex flex-col items-center justify-center p-8 bg-surface/80 border border-border/50 rounded-2xl shadow-sm">
        <div className="relative w-28 h-28 flex items-center justify-center rounded-full bg-secondary/30">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="52"
              fill="none"
              stroke="hsl(var(--secondary))"
              strokeWidth="8"
            />
            <circle
              cx="56"
              cy="56"
              r="52"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              strokeDasharray={326.72}
              strokeDashoffset={326.72 - (326.72 * percent) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="flex flex-col items-center z-10">
            <span className="text-3xl font-bold tracking-tighter">{percent}%</span>
          </div>
        </div>
        <p className="mt-4 text-sm font-medium text-muted-foreground">
          {percent === 100 ? 'Dia perfeito! 🏆' : 'Progresso de Hoje'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.habits.map((habit) => {
          const isDone = !!habit.history[todayStr]
          const completionsThisWeek = last7Days.filter((date) => habit.history[date]).length
          const freq = habit.frequencyPerWeek || 7
          const progressPercent = Math.min(100, Math.round((completionsThisWeek / freq) * 100))
          const isTargetMet = completionsThisWeek >= freq

          return (
            <SwipeableRow key={habit.id} onDelete={() => handleDelete(habit.id)}>
              <div className="flex flex-col p-5 bg-surface border border-border/60 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-inner"
                      style={{ backgroundColor: `${habit.color}20` }}
                    >
                      {habit.emoji}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg mb-0.5">{habit.name}</h3>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                        <Flame size={14} className={isTargetMet ? 'text-orange-500' : ''} />
                        <span className={isTargetMet ? 'text-orange-500' : ''}>
                          {completionsThisWeek} / {freq} na semana
                        </span>
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={isDone}
                    onCheckedChange={() => handleToggle(habit.id, isDone)}
                    className="mt-1.5"
                  />
                </div>

                <div className="space-y-2 mb-4">
                  <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${progressPercent}%`, backgroundColor: habit.color }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-border/40">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                    Últimos 7 dias
                  </span>
                  <div className="flex gap-1.5">
                    {last7Days.map((date) => {
                      const done = habit.history[date]
                      return (
                        <div
                          key={date}
                          className="w-4 h-4 rounded-[4px] transition-colors"
                          style={{
                            backgroundColor: done ? habit.color : 'hsl(var(--secondary))',
                          }}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>
            </SwipeableRow>
          )
        })}
        {state.habits.length === 0 && (
          <div className="text-center py-12 bg-surface/50 border border-dashed border-border rounded-xl text-muted-foreground md:col-span-2">
            Nenhum hábito rastreado. Comece criando um novo!
          </div>
        )}
      </div>

      <HabitFormSheet>
        <Button className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white z-50">
          <Plus size={28} />
        </Button>
      </HabitFormSheet>
    </div>
  )
}
