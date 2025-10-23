'use client'

import { useAuth } from '@/context/AuthContext'
import { useGetAllUnits } from '@/hooks/api/useUnit'
import { useSearchFilters } from '@/hooks/useSearchFilter'
import { PageContainer } from '@/components/layout/PageContainer'
import { getDashboardSearchConfig } from '@/config/search-config'
import { DataTableSearch } from '@/components/table/DataTableSearch'
import React, { useMemo, useState } from 'react'
import { DataTablePagination } from '@/components/table/DataTablePagination'
import { useGetAdminDashboardProcurements } from '@/hooks/api/useProcurement'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, FileText, XCircle } from 'lucide-react'
import { ProcurementsTable } from '@/features/(protected)/user/procurements/components/table/ProcurementTable'
import { createProcurementColumns } from '@/features/(protected)/user/procurements/components/table/ProcurementColumns'
import { useReactTable, getCoreRowModel, PaginationState, SortingState } from '@tanstack/react-table'

const Index = () => {
  const { user } = useAuth()

  // Sorting & Pagination state
  const [sorting, setSorting] = useState<SortingState>([])
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 })

  // Search & Filters (unitId)
  const { searchValue, appliedSearch, filters, setSearchValue, handleSearchSubmit, handleClearFilters, handleFilterChange } = useSearchFilters({
    unitId: ''
  })

  // Units for filter options
  const { data: unitsData } = useGetAllUnits()
  const unitOptions = useMemo(() => {
    if (!unitsData?.data) return []
    return unitsData.data.map((u) => ({ value: u.id, label: u.name }))
  }, [unitsData])

  const dynamicSearchConfig = useMemo(() => getDashboardSearchConfig(unitOptions), [unitOptions])

  // Query params
  const selectedUnitId = useMemo(() => {
    if (!filters.unitId || filters.unitId === 'all' || filters.unitId === '') return undefined
    return String(filters.unitId)
  }, [filters.unitId])

  const selectedUnitName = useMemo(() => {
    if (!selectedUnitId) return null
    const match = unitOptions.find((u) => String(u.value) === String(selectedUnitId))
    return match?.label ?? null
  }, [selectedUnitId, unitOptions])

  const queryParams = {
    page: pageIndex + 1,
    limit: pageSize,
    search: appliedSearch,
    unitId: selectedUnitId
  }

  const { data: dashboardData } = useGetAdminDashboardProcurements(queryParams)
  // Columns: reuse procurement columns without actions for dashboard
  const columns = useMemo(() => createProcurementColumns({ showActions: false }), [])

  const defaultData = useMemo(() => [], [])
  const table = useReactTable({
    data: dashboardData?.items || defaultData,
    columns,
    pageCount: dashboardData?.pagination?.total_page ?? -1,
    state: { pagination: { pageIndex, pageSize }, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true
  })

  return (
    <PageContainer>
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-tight">Hai, {user?.name || 'Pengguna'} 👋</h2>
        <p className="text-muted-foreground">
          {selectedUnitName
            ? `Ini adalah ringkasan aktivitas pada unit ${selectedUnitName}`
            : 'Ini adalah ringkasan aktivitas pada seluruh unit PT. BMU.'}
        </p>
      </div>
      <div className="grid mx-auto gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengajuan</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.summary.total_in_unit ?? 0}</div>
            <p className="text-xs text-muted-foreground">Total pengajuan dibuat</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.summary.total_approved ?? 0}</div>
            <p className="text-xs text-muted-foreground">Pengajuan yang berhasil</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.summary.total_rejected ?? 0}</div>
            <p className="text-xs text-muted-foreground">Pengajuan yang ditolak</p>
          </CardContent>
        </Card>
      </div>

      {/* Search bar */}
      <div className="mt-8 space-y-4">
        <DataTableSearch
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearchSubmit={handleSearchSubmit}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          config={dynamicSearchConfig}
        />

        {/* Table */}
        <ProcurementsTable
          table={table}
          isLoading={!dashboardData && unitOptions.length === 0}
          isFetching={false}
          error={undefined}
          exportOptions={{ enabled: true, fileName: 'dashboard-procurements', formats: ['csv', 'xlsx'], includeHeaders: true }}
        />

        {/* Pagination */}
        {dashboardData?.pagination && (
          <DataTablePagination
            currentPage={dashboardData.pagination.page}
            totalPages={dashboardData.pagination.total_page}
            pageSize={dashboardData.pagination.limit}
            totalItems={dashboardData.pagination.total_data}
            onPageChange={(page) => table.setPageIndex(page - 1)}
            onPageSizeChange={(size) => table.setPageSize(size)}
          />
        )}
      </div>
    </PageContainer>
  )
}

export default Index
