import { useState } from 'react'
import { useAppStore } from '@/store/AppContext'
import { TaskItem } from '@/components/TaskItem'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function Index() {
  const { state, setState, addXp } = useAppStore()
  const todayStr = new Date().toISOString().split('T')[0]

  const todayTasks = state.tasks.filter((t) => t.horizon === 'today')
  const doneToday = todayTasks.filter((t) => t.done).length
  const totalToday = todayTasks.length

  const habitsToday = state.habits.filter((h) => h.history[todayStr]).length
  const totalHabits = state.habits.length

  const handleHabitToggle = (id: string, currentlyDone: boolean) => {
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
    if (!currentlyDone)
      toast.success('Hábito concluído!', {
        style: { background: '#10b981', color: '#fff', border: 'none' },
      })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Energy Bar */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          Energia Hoje
        </p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => setState((s) => ({ ...s, energy: level }))}
              className={cn(
                'h-2 flex-1 rounded-full transition-all',
                state.energy >= level
                  ? level <= 2
                    ? 'bg-urgent'
                    : level <= 4
                      ? 'bg-finance'
                      : 'bg-success'
                  : 'bg-muted',
              )}
            />
          ))}
        </div>
      </div>

      {/* KPI Row */}
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
        <div className="min-w-[100px] bg-surface border border-border rounded-lg p-3">
          <p className="text-2xl font-bold">{totalToday - doneToday}</p>
          <p className="text-xs text-muted-foreground">Tarefas Pendentes</p>
        </div>
        <div className="min-w-[100px] bg-surface border border-border rounded-lg p-3">
          <p className="text-2xl font-bold text-success">{doneToday}</p>
          <p className="text-xs text-muted-foreground">Tarefas Concluídas</p>
        </div>
        <div className="min-w-[100px] bg-surface border border-border rounded-lg p-3">
          <p className="text-2xl font-bold text-normal">
            {habitsToday}/{totalHabits}
          </p>
          <p className="text-xs text-muted-foreground">Hábitos</p>
        </div>
      </div>

      {/* Focus Block */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="text-lg font-bold">Foco do Dia</h2>
          <span className="text-xs text-muted-foreground">
            {Math.round((doneToday / (totalToday || 1)) * 100)}% concluído
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5">
          <div
            className="bg-normal h-1.5 rounded-full transition-all"
            style={{ width: `${(doneToday / (totalToday || 1)) * 100}%` }}
          />
        </div>
        <div className="space-y-2 mt-4">
          {todayTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">Nenhuma tarefa para hoje.</p>
          ) : (
            todayTasks
              .sort((a, b) => Number(a.done) - Number(b.done))
              .map((task) => <TaskItem key={task.id} task={task} />)
          )}
        </div>
      </div>

      {/* Habits Checklist */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold">Checklist de Hábitos</h2>
        <div className="grid grid-cols-2 gap-2">
          {state.habits.map((habit) => {
            const isDone = !!habit.history[todayStr]
            return (
              <div
                key={habit.id}
                onClick={() => handleHabitToggle(habit.id, isDone)}
                className={cn(
                  'flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-colors',
                  isDone ? 'bg-success/10 border-success/30' : 'bg-surface border-border',
                )}
              >
                <Checkbox checked={isDone} readOnly className="h-4 w-4 rounded-full" />
                <span className="text-lg leading-none">{habit.emoji}</span>
                <span className="text-xs font-medium truncate">{habit.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
