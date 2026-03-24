import { useState } from 'react'
import { useAppStore } from '@/store/AppContext'
import { TaskItem } from '@/components/TaskItem'
import { TaskFormSheet } from '@/components/forms/TaskFormSheet'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Horizon } from '@/lib/types'

export default function Agenda() {
  const { state } = useAppStore()
  const [filterArea, setFilterArea] = useState<string>('all')

  const horizons: { id: Horizon; label: string }[] = [
    { id: 'today', label: 'Hoje' },
    { id: 'week', label: 'Semana' },
    { id: 'month', label: 'Mês' },
    { id: 'quarter', label: 'Trimestre' },
  ]

  const areas = ['all', 'work', 'personal', 'finance', 'health']

  const filteredTasks = state.tasks.filter((t) => filterArea === 'all' || t.area === filterArea)

  return (
    <div className="space-y-6 relative min-h-full pb-10">
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {areas.map((a) => (
          <Badge
            key={a}
            variant={filterArea === a ? 'default' : 'outline'}
            className="cursor-pointer capitalize px-3 py-1"
            onClick={() => setFilterArea(a)}
          >
            {a === 'all' ? 'Todas' : a}
          </Badge>
        ))}
      </div>

      <div className="space-y-6">
        {horizons.map((h) => {
          const tasksInHorizon = filteredTasks.filter((t) => t.horizon === h.id)
          if (tasksInHorizon.length === 0) return null

          return (
            <div key={h.id} className="space-y-3">
              <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">
                {h.label}
              </h3>
              <div className="space-y-2">
                {tasksInHorizon
                  .sort((a, b) => Number(a.done) - Number(b.done))
                  .map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
              </div>
            </div>
          )
        })}
        {filteredTasks.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">Nenhuma tarefa encontrada.</div>
        )}
      </div>

      <TaskFormSheet>
        <Button className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-elevation bg-normal hover:bg-normal/90 text-white z-50">
          <Plus size={24} />
        </Button>
      </TaskFormSheet>
    </div>
  )
}
