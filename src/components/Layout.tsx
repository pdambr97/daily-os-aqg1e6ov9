import { Outlet, Link, useLocation } from 'react-router-dom'
import { Home, Calendar, Activity, Target, DollarSign, CalendarDays } from 'lucide-react'
import { useAppStore } from '@/store/AppContext'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

const XP_THRESHOLDS = [0, 60, 160, 320, 550, 850, 1250, 1800, 2600, 3600]

export default function Layout() {
  const { state } = useAppStore()
  const location = useLocation()

  const currentXp = state.xp
  const levelIndex = XP_THRESHOLDS.findIndex((t) => t > currentXp)
  const level = levelIndex === -1 ? XP_THRESHOLDS.length : levelIndex
  const currentLevelXp = XP_THRESHOLDS[level - 1] || 0
  const nextLevelXp = XP_THRESHOLDS[level] || currentLevelXp
  const progressPercent =
    nextLevelXp === currentLevelXp
      ? 100
      : ((currentXp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100

  const navItems = [
    { path: '/', icon: Home, label: 'Hoje' },
    { path: '/agenda', icon: Calendar, label: 'Agenda' },
    { path: '/habitos', icon: Activity, label: 'Hábitos' },
    { path: '/metas', icon: Target, label: 'Metas' },
    { path: '/financas', icon: DollarSign, label: 'Finanças' },
    { path: '/semana', icon: CalendarDays, label: 'Semana' },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 h-16 bg-surface border-b border-border z-40 flex flex-col justify-center px-4 safe-top">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-sm">Nível {level}</span>
          <span className="text-xs text-normal font-medium">{currentXp} XP</span>
        </div>
        <Progress value={progressPercent} className="h-1.5 bg-background [&>div]:bg-normal" />
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 pt-20 px-4">
        <Outlet />
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 inset-x-0 h-16 bg-surface border-t border-border z-40 flex items-center justify-around safe-bottom">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center w-full h-full"
            >
              <Icon
                size={22}
                className={cn(
                  'mb-1 transition-colors',
                  isActive ? 'text-normal' : 'text-muted-foreground',
                )}
              />
              <span
                className={cn(
                  'text-[10px] font-medium',
                  isActive ? 'text-normal' : 'text-muted-foreground',
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
