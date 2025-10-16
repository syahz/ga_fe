'use client'

import { format } from 'date-fns'
import { ArrowUpDown } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'

import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Procurement, ProcurementStatus } from '@/types/api/procurementType'
import { ProcurementActionsCell } from './ProcurementActionsCell'

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

export const ProcurementsColumns: ColumnDef<Procurement>[] = [
  {
    accessorKey: 'letterNumber',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Nomor Surat
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    )
  },
  {
    accessorKey: 'letterAbout',
    header: 'Perihal',
    cell: ({ row }) => <div className="max-w-[300px] truncate">{row.getValue('letterAbout')}</div>
  },
  {
    accessorKey: 'nominal',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Nominal
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-right font-medium">{formatCurrency(Number(row.getValue('nominal')))}</div>
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as Procurement['status']
      const badgeVariant = getStatusBadgeVariant(status)
      const mappedVariant = badgeVariant === 'yellow' || badgeVariant === 'orange' ? 'secondary' : badgeVariant === 'green' ? 'default' : badgeVariant
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
    cell: ({ row }) => format(new Date(row.getValue('createdAt')), 'dd MMM yyyy')
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Aksi</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right">
          <ProcurementActionsCell row={row} />
        </div>
      )
    }
  }
]
