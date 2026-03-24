import React, { createContext, useContext, useEffect, useState } from 'react'
import { AppState } from '@/lib/types'
import { mockState } from '@/lib/mockData'
import { toast } from 'sonner'

interface AppContextType {
  state: AppState
  setState: React.Dispatch<React.SetStateAction<AppState>>
  addXp: (amount: number, reason: string) => void
}

const AppContext = createContext<AppContextType | null>(null)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('dani-os-state')
      return saved ? JSON.parse(saved) : mockState
    } catch {
      return mockState
    }
  })

  useEffect(() => {
    localStorage.setItem('dani-os-state', JSON.stringify(state))
  }, [state])

  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  const addXp = (amount: number, reason: string) => {
    setState((s) => ({ ...s, xp: s.xp + amount }))
    toast.success(`+${amount} XP`, {
      description: reason,
      icon: '🏆',
      style: { background: '#f0c040', color: '#000', border: 'none' },
    })
  }

  return <AppContext.Provider value={{ state, setState, addXp }}>{children}</AppContext.Provider>
}

export const useAppStore = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppStore must be used within AppProvider')
  return context
}
