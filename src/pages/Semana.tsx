import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/AppContext'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'

export default function Semana() {
  const { state, setState } = useAppStore()
  const [text, setText] = useState(state.weeklyReflection)
  const [status, setStatus] = useState('')

  const weekTasks = state.tasks.filter((t) => t.horizon === 'week' || t.horizon === 'today')
  const doneWeek = weekTasks.filter((t) => t.done).length
  const rate = weekTasks.length ? Math.round((doneWeek / weekTasks.length) * 100) : 0

  // Rough estimate for week XP based on done tasks for simplicity
  const weekXp = weekTasks.filter((t) => t.done).reduce((acc, t) => acc + t.xp, 0)

  const areas = ['work', 'personal', 'finance', 'health'] as const
  const areaLabels = { work: 'Trabalho', personal: 'Pessoal', finance: 'Finanças', health: 'Saúde' }

  // Auto-save debounce
  useEffect(() => {
    setStatus('Salvando...')
    const timer = setTimeout(() => {
      setState((s) => ({ ...s, weeklyReflection: text }))
      setStatus('Salvo automaticamente')
    }, 1000)
    return () => clearTimeout(timer)
  }, [text, setState])

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface p-4 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Tarefas Semana</p>
          <p className="text-2xl font-bold mt-1">
            {doneWeek}/{weekTasks.length}
          </p>
        </div>
        <div className="bg-surface p-4 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">XP Semanal</p>
          <p className="text-2xl font-bold text-finance mt-1">+{weekXp}</p>
        </div>
      </div>

      <div className="bg-surface p-4 rounded-lg border border-border space-y-4">
        <h3 className="font-bold">Execução por Área</h3>
        {areas.map((a) => {
          const t = weekTasks.filter((task) => task.area === a)
          const d = t.filter((task) => task.done).length
          const perc = t.length ? (d / t.length) * 100 : 0
          return (
            <div key={a} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-muted-foreground">{areaLabels[a]}</span>
                <span>
                  {d}/{t.length}
                </span>
              </div>
              <Progress value={perc} className="h-1.5 bg-background [&>div]:bg-normal" />
            </div>
          )
        })}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg">Reflexão Semanal</h2>
          <span className="text-[10px] text-muted-foreground uppercase">{status}</span>
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="O que funcionou bem? O que pode melhorar na próxima semana?"
          className="min-h-[200px] bg-surface border-border resize-none text-sm"
        />
      </div>
    </div>
  )
}
