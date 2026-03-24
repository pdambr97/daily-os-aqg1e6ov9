import { Task } from '@/lib/types'
import { Checkbox } from '@/components/ui/checkbox'
import { SwipeableRow } from './SwipeableRow'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/AppContext'

interface TaskItemProps {
  task: Task
}

export const TaskItem = ({ task }: TaskItemProps) => {
  const { setState, addXp } = useAppStore()

  const handleToggle = () => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)),
    }))
    if (!task.done) {
      addXp(task.xp, 'Tarefa concluída')
    }
  }

  const handleDelete = () => {
    setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== task.id) }))
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.done

  return (
    <SwipeableRow onDelete={handleDelete}>
      <div
        className={cn(
          'flex items-center gap-3 p-3 bg-surface border border-border rounded-md border-l-4',
          `priority-${task.priority}`,
        )}
      >
        <Checkbox
          checked={task.done}
          onCheckedChange={handleToggle}
          className="h-5 w-5 rounded-full"
        />
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              'text-sm font-medium truncate',
              task.done && 'line-through text-muted-foreground',
            )}
          >
            {task.text}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <span className="capitalize">{task.area}</span>
            <span>•</span>
            <span className="text-normal">{task.xp} XP</span>
            {task.dueDate && (
              <>
                <span>•</span>
                <span className={cn(isOverdue && 'text-urgent font-medium')}>
                  {new Date(task.dueDate).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                  })}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </SwipeableRow>
  )
}
