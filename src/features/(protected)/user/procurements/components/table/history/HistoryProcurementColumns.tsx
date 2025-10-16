'use client'

import { formatDateID } from '@/utils/text'
import { Button } from '@/components/ui/button'
import { ProcurementHistoryLog } from '@/types/api/procurementType'
import { ArrowUpDown } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, truncateText } from '@/lib/utils'

export const HistoryProcurementColumns: ColumnDef<ProcurementHistoryLog>[] = [
  {
    accessorKey: 'letter.letterNumber',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Nomor Surat
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-medium">{row.original.letter.letterNumber}</span>
  },
  {
    accessorKey: 'unit.name',
    header: 'Nama Unit Usaha',
    cell: ({ row }) => (
      <Badge variant={'outline'} className="font-medium">
        {row.original.letter.unit.name}
      </Badge>
    )
  },
  {
    accessorKey: 'letter.letterAbout',
    header: 'Perihal Surat',
    cell: ({ row }) => <span className="font-medium">{truncateText(row.original.letter.letterAbout, 20)}</span>
  },
  {
    accessorKey: 'letter.nominal',
    header: 'Nominal',
    cell: ({ row }) => <span className="font-medium">{formatCurrency(parseFloat(row.original.letter.nominal))}</span>
  },
  {
    accessorKey: 'logs.action',
    header: 'Tindakan',
    cell: ({ row }) => (
      <Badge variant={'secondary'} className="font-medium">
        {row.original.action}
      </Badge>
    )
  },
  {
    accessorKey: 'timestamp',
    header: 'Tanggal Aksi',
    cell: ({ row }) => {
      const date = row.original.timestamp
      return formatDateID(date)
    }
  }
]
