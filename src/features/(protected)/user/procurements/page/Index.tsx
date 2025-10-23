'use client'

import { Button } from '@/components/ui/button'
import { useSearchFilters } from '@/hooks/useSearchFilter'
import { ProcurementSearchConfig } from '@/config/search-config'
import { ProcurementsTable } from '../components/table/ProcurementTable'
import { PlusCircle } from 'lucide-react'
import { ProcurementsColumns } from '../components/table/ProcurementColumns'
import { PageContainer } from '@/components/layout/PageContainer'
import { DataTableSearch } from '@/components/table/DataTableSearch'
import React, { useState, useMemo } from 'react'
import { DataTablePagination } from '@/components/table/DataTablePagination'
import { useReactTable, getCoreRowModel, PaginationState, SortingState } from '@tanstack/react-table'
import Link from 'next/link'
import { useGetProcurements } from '@/hooks/api/useProcurement'
import { useAuth } from '@/context/AuthContext'
import { useGetRules } from '@/hooks/api/useRule'

export default function UsersPage() {
  const { user } = useAuth()
  const { data: rulesData, isLoading: isLoadingRules } = useGetRules()

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

  const { data, isLoading, error, isFetching } = useGetProcurements(queryParams)

  const canCreateProcurement = useMemo(() => {
    if (!user || !rulesData?.items) return false

    // Iterasi setiap aturan untuk mengecek apakah role user saat ini adalah 'CREATE'
    return rulesData.items.some((rule) => rule.steps.some((step) => step.stepType === 'CREATE' && step.role.name === user.role))
  }, [user, rulesData])

  const defaultData = useMemo(() => [], [])
  const columns = useMemo(() => ProcurementsColumns, [])

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
        {canCreateProcurement && (
          <Link href={'/user/procurements/create'}>
            <Button size="sm" variant="default" className="flex items-center gap-2">
              <PlusCircle size={16} />
              <span>Tambah Pengadaan</span>
            </Button>
          </Link>
        )}
      </div>

      <div className="space-y-4">
        <DataTableSearch
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearchSubmit={handleSearchSubmit}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          config={ProcurementSearchConfig}
        />

        {/* Panggil ProcurementsTable dengan props yang sudah di-upgrade */}
        <ProcurementsTable table={table} isLoading={isLoading || isLoadingRules} isFetching={isFetching} error={error as Error | null | undefined} />

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
