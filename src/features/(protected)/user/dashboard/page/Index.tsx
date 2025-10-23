'use client'

import { PageContainer } from '@/components/layout/PageContainer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Clock, FileText, XCircle } from 'lucide-react'
import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { ProcurementStatus } from '@/types/api/procurementType'
import { useGetDashboardProcurements } from '@/hooks/api/useProcurement'

const Dashboard = () => {
  const { user } = useAuth()
  const { data: dashboardProcurements } = useGetDashboardProcurements()

  // Kalkulasi summary dari data
  const totalSubmissions = dashboardProcurements?.length || 0
  const approvedCount = dashboardProcurements?.filter((s) => s.status === ProcurementStatus.APPROVED).length || 0
  const pendingCount =
    dashboardProcurements?.filter((s) => s.status === ProcurementStatus.PENDING_REVIEW || s.status === ProcurementStatus.NEEDS_REVISION).length || 0
  const rejectedCount = dashboardProcurements?.filter((s) => s.status === ProcurementStatus.REJECTED).length || 0

  return (
    <PageContainer title="User Dashboard">
      <div className="space-y-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold tracking-tight">Hai, {user?.name || 'Pengguna'} 👋</h2>
          <p className="text-muted-foreground">Ini adalah ringkasan aktivitas pada unit {user?.unit}.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pengajuan</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSubmissions}</div>
              <p className="text-xs text-muted-foreground">Total pengajuan dibuat</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedCount}</div>
              <p className="text-xs text-muted-foreground">Pengajuan yang berhasil</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Menunggu Aksi</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">Perlu ditinjau/direvisi</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rejectedCount}</div>
              <p className="text-xs text-muted-foreground">Pengajuan yang ditolak</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}

export default Dashboard
