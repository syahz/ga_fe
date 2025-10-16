'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSearchFilters } from '@/hooks/useSearchFilter'
import { orderSearchConfig } from '@/config/search-config'
import { PlusCircle } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { DataTableSearch } from '@/components/table/DataTableSearch'
import React, { useState, useMemo } from 'react'
import { useGetUserProcurementHistory } from '@/hooks/api/useProcurement'
import { DataTablePagination } from '@/components/table/DataTablePagination'
import { useReactTable, getCoreRowModel, PaginationState, SortingState } from '@tanstack/react-table'
import { HistoryProcurementTable } from '@/features/(protected)/user/procurements/components/table/history/HistoryProcurementTable'
import { HistoryProcurementColumns } from '@/features/(protected)/user/procurements/components/table/history/HistoryProcurementColumns'

export default function History() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  })

  const { searchValue, appliedSearch, filters, setSearchValue, handleSearchSubmit, handleClearFilters, handleFilterChange } = useSearchFilters({})

  const queryParams = {
    page: pageIndex + 1,
    limit: pageSize,
    search: appliedSearch,
    sortBy: sorting.length > 0 ? sorting[0].id : undefined,
    sortOrder: sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined
  }

  const { data, isLoading, error, isFetching } = useGetUserProcurementHistory(queryParams)

  const defaultData = useMemo(() => [], [])
  const columns = useMemo(() => HistoryProcurementColumns, [])

  const table = useReactTable({
    data: data?.items || defaultData,
    columns,
    pageCount: data?.pagination?.total_page ?? -1,
    state: {
      pagination: { pageIndex, pageSize },
      sorting
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true
  })

  React.useEffect(() => {
    const totalPages = data?.pagination?.total_page
    if (totalPages && pageIndex >= totalPages) {
      table.setPageIndex(0)
    }
  }, [data?.pagination?.total_page, pageIndex, table])

  return (
    <PageContainer title="Role User">
      <div className="flex w-full gap-4 py-4 items-center justify-between">
        <h2 className="text-xl font-semibold">Kotak Masuk Pengadaan</h2>
        <Link href={'/admin/procurements/create'}>
          <Button size="sm" variant="default" className="flex items-center gap-2">
            <PlusCircle size={16} />
            <span>Tambah Pengadaan</span>
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <DataTableSearch
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearchSubmit={handleSearchSubmit}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          config={orderSearchConfig}
        />

        {/* Panggil HistoryProcurementTable dengan props yang sudah di-upgrade */}
        <HistoryProcurementTable table={table} isLoading={isLoading} isFetching={isFetching} error={error as Error | null | undefined} />

        {/* Paginasi sekarang dikontrol oleh table instance */}
        {data?.pagination && (
          <DataTablePagination
            currentPage={data.pagination.page}
            totalPages={data.pagination.total_page}
            pageSize={data.pagination.limit}
            totalItems={data.pagination.total_data}
            onPageChange={(page) => table.setPageIndex(page - 1)}
            onPageSizeChange={(size) => table.setPageSize(size)}
          />
        )}
      </div>
    </PageContainer>
  )
}
