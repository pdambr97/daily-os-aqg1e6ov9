import React, { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppStore } from '@/store/AppContext'

export const TransactionFormSheet = ({ children }: { children: React.ReactNode }) => {
  const { setState } = useAppStore()
  const [open, setOpen] = useState(false)
  const [desc, setDesc] = useState('')
  const [cat, setCat] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('expense')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!desc || !amount) return
    setState((s) => ({
      ...s,
      transactions: [
        ...s.transactions,
        {
          id: Math.random().toString(),
          description: desc,
          category: cat || 'Geral',
          amount: parseFloat(amount),
          type,
          date: new Date().toISOString().split('T')[0],
        },
      ],
    }))
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[70vh] rounded-t-xl bg-surface border-t border-border"
      >
        <SheetHeader>
          <SheetTitle>Nova Transação</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant={type === 'expense' ? 'destructive' : 'outline'}
              onClick={() => setType('expense')}
            >
              Despesa
            </Button>
            <Button
              type="button"
              variant={type === 'income' ? 'default' : 'outline'}
              className={type === 'income' ? 'bg-success hover:bg-success/90 text-white' : ''}
              onClick={() => setType('income')}
            >
              Receita
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input value={desc} onChange={(e) => setDesc(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Valor (R$)</Label>
            <Input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Input value={cat} onChange={(e) => setCat(e.target.value)} />
          </div>
          <Button type="submit" className="w-full mt-4">
            Salvar
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export const AssetFormSheet = ({ children }: { children: React.ReactNode }) => {
  const { setState } = useAppStore()
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!label || !amount) return
    setState((s) => ({
      ...s,
      assets: [
        ...s.assets,
        { id: Math.random().toString(), label, amount: parseFloat(amount), color: '#fbbf24' },
      ],
    }))
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[50vh] rounded-t-xl bg-surface border-t border-border"
      >
        <SheetHeader>
          <SheetTitle>Novo Ativo</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Valor (R$)</Label>
            <Input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full mt-4">
            Salvar
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
