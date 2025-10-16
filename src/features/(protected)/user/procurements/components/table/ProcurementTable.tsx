'use client'

import { DataTable } from '@/components/table/DataTable'
import { Procurement } from '@/types/api/procurementType'
import { Table } from '@tanstack/react-table'

// Props diubah untuk menerima 'table instance'
interface ProcurementsTableProps {
  table: Table<Procurement>
  isLoading: boolean
  isFetching: boolean
  error?: Error | null
}

export function ProcurementsTable({ table, isLoading, isFetching, error }: ProcurementsTableProps) {
  return (
    <DataTable
      table={table}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      emptyMessage="Tidak ada data pengadaan yang sesuai dengan filter."
      errorMessage="Gagal memuat data pengadaan. Silakan coba lagi."
    />
  )
}
