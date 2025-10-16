'use client'

import { Rule, Step } from '@/types/api/ruleType'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface StepPillProps {
  step: Step
}

const StepPill = ({ step }: StepPillProps) => {
  const stepInfo = {
    CREATE: { label: 'Pembuat', color: 'bg-blue-100 text-blue-800' },
    REVIEW: { label: 'Peninjau', color: 'bg-yellow-100 text-yellow-800' },
    APPROVE: { label: 'Penyetuju', color: 'bg-green-100 text-green-800' }
  }

  return (
    <div className="flex items-center justify-between text-sm">
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stepInfo[step.stepType].color}`}>{stepInfo[step.stepType].label}</span>
      <span className="text-muted-foreground text-right">{step.role.name}</span>
    </div>
  )
}

interface RuleCardProps {
  rule: Rule
  onEditDetails: (id: string) => void
  onEditSteps: (rule: Rule) => void
  onDelete: (id: string) => void
}

export const RuleCard = ({ rule, onEditDetails, onEditSteps, onDelete }: RuleCardProps) => {
  const { id, name, minAmount, maxAmount, steps } = rule

  const amountRange =
    maxAmount === null ? `> ${formatCurrency(Number(minAmount))}` : `${formatCurrency(Number(minAmount))} - ${formatCurrency(Number(maxAmount))}`

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between pb-4">
        <div className="flex flex-col space-y-1">
          <CardTitle>{name}</CardTitle>
          <CardDescription>{amountRange}</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Buka menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEditDetails(id)}>Edit Detail Aturan</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditSteps(rule)}>Edit Langkah Persetujuan</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(id)} className="text-destructive focus:bg-destructive/10">
              Hapus Aturan
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        {steps
          .sort((a, b) => a.stepOrder - b.stepOrder)
          .map((step) => (
            <StepPill key={step.id} step={step} />
          ))}
      </CardContent>
    </Card>
  )
}
