export type Horizon = 'today' | 'week' | 'month' | 'quarter'
export type Priority = 'urgent' | 'high' | 'normal' | 'low'
export type Area = 'work' | 'personal' | 'finance' | 'health'

export interface Task {
  id: string
  text: string
  area: Area
  priority: Priority
  horizon: Horizon
  dueDate?: string
  xp: number
  done: boolean
  createdAt: string
}

export interface Habit {
  id: string
  name: string
  description?: string
  emoji: string
  color: string
  history: Record<string, boolean> // key: YYYY-MM-DD
}

export interface Goal {
  id: string
  title: string
  area: Area
  horizon: 'semanal' | 'mensal' | 'anual'
  progress: number // 0 to 100
}

export interface Transaction {
  id: string
  description: string
  category: string
  amount: number
  type: 'income' | 'expense'
  date: string // YYYY-MM-DD
}

export interface Asset {
  id: string
  label: string
  amount: number
  color: string
}

export interface AppState {
  xp: number
  energy: number
  tasks: Task[]
  habits: Habit[]
  goals: Goal[]
  transactions: Transaction[]
  assets: Asset[]
  weeklyReflection: string
}
