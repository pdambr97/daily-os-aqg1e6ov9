import { useState } from 'react'
import { useAppStore } from '@/store/AppContext'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { TransactionFormSheet, AssetFormSheet } from '@/components/forms/FinanceForms'

export default function Financas() {
  const { state } = useAppStore()

  // Basic month handling (simplification for constraints)
  const currentMonthPrefix = new Date().toISOString().substring(0, 7) // YYYY-MM
  const monthTransactions = state.transactions.filter((t) => t.date.startsWith(currentMonthPrefix))

  const income = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((a, b) => a + b.amount, 0)
  const expense = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((a, b) => a + b.amount, 0)
  const balance = income - expense
  const savingsRate = income > 0 ? (balance / income) * 100 : 0

  const totalAssets = state.assets.reduce((a, b) => a + b.amount, 0)

  const formatBRL = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <div className="flex justify-between items-center bg-surface p-3 rounded-md border border-border">
        <span className="font-bold uppercase tracking-wider text-sm">
          {new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface p-3 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground">Receitas</p>
          <p className="text-lg font-bold text-success">{formatBRL(income)}</p>
        </div>
        <div className="bg-surface p-3 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground">Gastos</p>
          <p className="text-lg font-bold text-urgent">{formatBRL(expense)}</p>
        </div>
        <div className="bg-surface p-3 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground">Saldo</p>
          <p className={`text-lg font-bold ${balance > 0 ? 'text-finance' : 'text-urgent'}`}>
            {formatBRL(balance)}
          </p>
        </div>
        <div className="bg-surface p-3 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground">Taxa de Poupança</p>
          <p className="text-lg font-bold text-blue-400">{savingsRate.toFixed(1)}%</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <h2 className="font-bold text-lg">Transações</h2>
          <TransactionFormSheet>
            <span className="text-normal text-xs font-bold uppercase cursor-pointer">
              + Adicionar
            </span>
          </TransactionFormSheet>
        </div>
        {monthTransactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma transação.</p>
        ) : null}
        {monthTransactions.map((t) => (
          <div
            key={t.id}
            className="flex justify-between items-center p-3 bg-surface border border-border rounded-md"
          >
            <div>
              <p className="font-medium text-sm">{t.description}</p>
              <p className="text-xs text-muted-foreground">{t.category}</p>
            </div>
            <p
              className={`font-bold text-sm ${t.type === 'income' ? 'text-success' : 'text-foreground'}`}
            >
              {t.type === 'expense' ? '-' : '+'}
              {formatBRL(t.amount)}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-bold text-lg text-finance">Patrimônio Total</h2>
            <p className="text-2xl font-bold">{formatBRL(totalAssets)}</p>
          </div>
          <AssetFormSheet>
            <span className="text-normal text-xs font-bold uppercase cursor-pointer">
              + Adicionar
            </span>
          </AssetFormSheet>
        </div>

        <div className="space-y-3">
          {state.assets.map((a) => (
            <div key={a.id} className="p-3 bg-surface border border-border rounded-md">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{a.label}</span>
                <span className="font-bold">{formatBRL(a.amount)}</span>
              </div>
              <div className="w-full bg-background h-1.5 rounded-full">
                <div
                  className="h-1.5 rounded-full"
                  style={{ width: `${(a.amount / totalAssets) * 100}%`, backgroundColor: a.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
