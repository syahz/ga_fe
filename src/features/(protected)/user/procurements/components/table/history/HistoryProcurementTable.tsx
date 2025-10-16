'use client'

import { DataTable } from '@/components/table/DataTable'
import { Table } from '@tanstack/react-table'
import { ProcurementHistoryLog } from '@/types/api/procurementType'

// Props diubah untuk menerima 'table instance'
interface HistoryProcurementTableProps {
  table: Table<ProcurementHistoryLog>
  isLoading: boolean
  isFetching: boolean
  error?: Error | null
}

export function HistoryProcurementTable({ table, isLoading, isFetching, error }: HistoryProcurementTableProps) {
  return (
    <DataTable
      table={table}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      emptyMessage="Tidak ada Pengadaan Masuk Untuk Saat Ini ."
      errorMessage="Gagal memuat data Pengadaan Surat. Silakan coba lagi."
    />
  )
}
