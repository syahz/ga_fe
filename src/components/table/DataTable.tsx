'use client'

import { Table as TanstackTable, flexRender } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertCircle } from 'lucide-react'
import { DataTableSkeleton } from './DataTableSkeleton'

// Props sekarang menerima 'table' instance dan state loading/error
interface DataTableProps<TData> {
  table: TanstackTable<TData>
  isLoading: boolean
  isFetching: boolean
  error?: Error | null
  emptyMessage?: string
  errorMessage?: string
}

export function DataTable<TData>({ table, isLoading, isFetching, error, emptyMessage = 'No data found', errorMessage }: DataTableProps<TData>) {
  if (isLoading) {
    // Tampilkan skeleton saat loading pertama kali
    return <DataTableSkeleton columns={table.getAllColumns().length} rows={table.getState().pagination.pageSize} />
  }

  if (error) {
    return (
      <div className="rounded-md border">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Error loading data</h3>
          <p className="text-sm text-muted-foreground mt-2">{errorMessage || error.message || 'Something went wrong while fetching the data.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Overlay saat re-fetching data (misal: ganti halaman) */}
      {isFetching && (
        <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      <div className="relative w-full overflow-x-auto rounded-md border">
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={'className' in header.column.columnDef ? (header.column.columnDef.className as string | undefined) : undefined}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={'className' in cell.column.columnDef ? (cell.column.columnDef.className as string | undefined) : undefined}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
