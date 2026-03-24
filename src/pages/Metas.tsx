import { useAppStore } from '@/store/AppContext'
import { GoalFormSheet } from '@/components/forms/GoalFormSheet'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { SwipeableRow } from '@/components/SwipeableRow'

export default function Metas() {
  const { state, setState } = useAppStore()

  const areas = ['work', 'personal', 'finance', 'health'] as const
  const areaLabels = { work: 'Trabalho', personal: 'Pessoal', finance: 'Finanças', health: 'Saúde' }

  const handleProgress = (id: string, amount: number) => {
    setState((s) => ({
      ...s,
      goals: s.goals.map((g) =>
        g.id === id ? { ...g, progress: Math.min(100, Math.max(0, g.progress + amount)) } : g,
      ),
    }))
  }

  const handleDelete = (id: string) => {
    setState((s) => ({ ...s, goals: s.goals.filter((g) => g.id !== id) }))
  }

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      {/* Overview Grid */}
      <div className="grid grid-cols-2 gap-3">
        {areas.map((a) => {
          const areaGoals = state.goals.filter((g) => g.area === a)
          const avg = areaGoals.length
            ? areaGoals.reduce((acc, g) => acc + g.progress, 0) / areaGoals.length
            : 0
          return (
            <div key={a} className="bg-surface p-3 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground font-medium">{areaLabels[a]}</p>
              <p className="text-xl font-bold mt-1">{Math.round(avg)}%</p>
            </div>
          )
        })}
      </div>

      <div className="space-y-4">
        <h2 className="font-bold text-lg">Suas Metas</h2>
        {state.goals.map((goal) => (
          <SwipeableRow key={goal.id} onDelete={() => handleDelete(goal.id)}>
            <div className="bg-surface p-4 rounded-md border border-border space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{goal.title}</h3>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                      {areaLabels[goal.area]}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 capitalize">
                      {goal.horizon}
                    </Badge>
                  </div>
                </div>
                {goal.progress >= 100 ? (
                  <Badge className="bg-success text-white">Concluída! 🏆</Badge>
                ) : (
                  <span className="font-bold text-sm">{goal.progress}%</span>
                )}
              </div>

              <Progress value={goal.progress} className="h-2 bg-background [&>div]:bg-normal" />

              {goal.progress < 100 && (
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleProgress(goal.id, -10)}
                    className="flex-1 h-7 text-xs"
                  >
                    -10%
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleProgress(goal.id, 10)}
                    className="flex-1 h-7 text-xs"
                  >
                    +10%
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleProgress(goal.id, 20)}
                    className="flex-1 h-7 text-xs"
                  >
                    +20%
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleProgress(goal.id, 50)}
                    className="flex-1 h-7 text-xs"
                  >
                    +50%
                  </Button>
                </div>
              )}
            </div>
          </SwipeableRow>
        ))}
        {state.goals.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">Nenhuma meta definida.</div>
        )}
      </div>

      <GoalFormSheet>
        <Button className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-elevation bg-normal hover:bg-normal/90 text-white z-50">
          <Plus size={24} />
        </Button>
      </GoalFormSheet>
    </div>
  )
}
