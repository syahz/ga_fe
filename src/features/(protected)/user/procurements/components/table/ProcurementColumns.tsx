'use client'

import { format } from 'date-fns'
import { ArrowUpDown } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'

import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ProcurementActionsCell } from './ProcurementActionsCell'
import { Procurement, ProcurementStatus } from '@/types/api/procurementType'

// Helper untuk memberikan warna pada status
const getStatusBadgeVariant = (status: ProcurementStatus) => {
  switch (status) {
    case 'PENDING_REVIEW':
      return 'yellow'
    case 'APPROVED':
      return 'green'
    case 'REJECTED':
      return 'destructive'
    case 'NEEDS_REVISION':
      return 'orange'
    default:
      return 'secondary'
  }
}

export function createProcurementColumns(options?: { showActions?: boolean }): ColumnDef<Procurement>[] {
  const showActions = options?.showActions ?? true
  const cols: ColumnDef<Procurement>[] = [
    {
      accessorKey: 'unit.name',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Unit
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      meta: { className: 'sticky left-0 bg-card z-0 min-w-[150px]', exportLabel: 'Unit' }
    },
    {
      accessorKey: 'letterNumber',
      header: 'Nomor Surat',
      cell: ({ row }) => <span className="truncate">{row.getValue('letterNumber')}</span>
    },
    {
      accessorKey: 'letterAbout',
      header: 'Perihal',
      cell: ({ row }) => <span className="max-w-[300px] truncate">{row.getValue('letterAbout')}</span>
    },
    {
      accessorKey: 'nominal',
      header: 'Nominal',
      cell: ({ row }) => <span className="font-medium">{formatCurrency(Number(row.getValue('nominal')))}</span>
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as Procurement['status']
        const badgeVariant = getStatusBadgeVariant(status)
        const mappedVariant =
          badgeVariant === 'yellow' || badgeVariant === 'orange' ? 'secondary' : badgeVariant === 'green' ? 'default' : badgeVariant
        return <Badge variant={mappedVariant}>{status.replace('_', ' ')}</Badge>
      },
      enableSorting: false
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Tanggal Dibuat
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span className="ms-4">{format(new Date(row.getValue('createdAt')), 'dd MMM yyyy')}</span>,
      meta: { exportLabel: 'Tanggal Dibuat', exportValue: (row: Procurement) => new Date(row.createdAt).toISOString() }
    },
    {
      accessorKey: 'letter.progress',
      header: 'Progress',
      cell: ({ row }) => (
        <Link href={`/progress/${row.original.id}`} className="text-blue-600 underline">
          Lihat Progress
        </Link>
      ),
      meta: { exportable: false }
    }
  ]

  if (showActions) {
    cols.push({
      id: 'actions',
      header: () => <div>Aksi</div>,
      cell: ({ row }) => (
        <div>
          <ProcurementActionsCell row={row} />
        </div>
      )
    })
  }

  return cols
}

export const ProcurementsColumns: ColumnDef<Procurement>[] = createProcurementColumns({ showActions: true })
