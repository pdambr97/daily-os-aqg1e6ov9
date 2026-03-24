import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'

export const SwipeableRow = ({
  children,
  onDelete,
}: {
  children: React.ReactNode
  onDelete: () => void
}) => {
  const [offset, setOffset] = useState(0)
  let startX = 0

  const handleTouchStart = (e: React.TouchEvent) => {
    startX = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const diff = e.touches[0].clientX - startX
    if (diff < 0) {
      setOffset(Math.max(diff, -80))
    }
  }

  const handleTouchEnd = () => {
    if (offset < -50) {
      onDelete()
    }
    setOffset(0)
  }

  return (
    <div className="relative overflow-hidden w-full bg-red-500/20 rounded-md">
      <div
        className="absolute right-0 top-0 bottom-0 flex items-center justify-center w-[80px] bg-red-500 text-white cursor-pointer"
        onClick={onDelete}
      >
        <Trash2 size={20} />
      </div>
      <div
        className="relative bg-background transition-transform duration-200 ease-out"
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  )
}
