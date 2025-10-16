'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Participant } from '@/types/api/participantType'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { ParticipantActionsCell } from './ParticipantActionsCell'
// import { ParticipantActionsCell } from './ParticipantActionsCell' // Komponen ini perlu Anda buat

export const ParticipantColumns: ColumnDef<Participant>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Nama
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <Badge variant="outline">{row.original.role.name}</Badge>,
    // Menonaktifkan sorting untuk kolom relasi sederhana
    enableSorting: false
  },
  {
    accessorKey: 'unit',
    header: 'Unit',
    cell: ({ row }) => <Badge variant="secondary">{row.original.unit.name}</Badge>,
    enableSorting: false
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ParticipantActionsCell userId={row.original.id} userName={row.original.name} />
  }
]
