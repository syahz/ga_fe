'use client'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import dynamic from 'next/dynamic'
import { formatCurrency, formatDateID } from '@/lib/utils'
import { useGetProcurementLetterFile, useGetProgress } from '@/hooks/api/useProcurement'
import { DynamicSkeleton } from '@/components/ui/dynamic-skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, FilePlus2, Send, Timer, XCircle, FileClock, UserCheck } from 'lucide-react'
import { useParams } from 'next/navigation'

const PdfViewer = dynamic(() => import('@/components/ui/pdf-viewer').then((mod) => mod.PdfViewer), {
  ssr: false, // This is the key part
  loading: () => <p>Loading PDF Viewer...</p> // Optional loading indicator
})

// Helper untuk memilih ikon berdasarkan Aksi
const getLogIcon = (action: string) => {
  const iconProps = { className: 'h-5 w-5' }
  switch (action) {
    case 'CREATED':
      return <FilePlus2 {...iconProps} />
    case 'SUBMITTED':
      return <Send {...iconProps} />
    case 'APPROVED':
      return <CheckCircle2 {...iconProps} />
    case 'REJECTED':
      return <XCircle {...iconProps} />
    case 'REVISED':
      return <FileClock {...iconProps} />
    case 'ASSIGNED':
      return <UserCheck {...iconProps} />
    default:
      return <Timer {...iconProps} />
  }
}

// Helper untuk warna latar ikon
const getLogColor = (action: string) => {
  switch (action) {
    case 'CREATED':
      return 'bg-sky-500'
    case 'SUBMITTED':
      return 'bg-blue-500'
    case 'APPROVED':
      return 'bg-green-500'
    case 'REJECTED':
      return 'bg-red-500'
    case 'REVISED':
      return 'bg-yellow-500'
    case 'ASSIGNED':
      return 'bg-purple-500'
    default:
      return 'bg-gray-400'
  }
}

// Helper untuk warna badge status
const getStatusBadgeVariant = (status: string): 'default' | 'destructive' | 'secondary' | 'outline' => {
  switch (status) {
    case 'APPROVED':
      return 'default' // Warna hijau di global.css
    case 'REJECTED':
      return 'destructive'
    case 'REVISED':
      return 'secondary'
    default:
      return 'outline'
  }
}

const formatLogAction = (action: string) => {
  const actions: { [key: string]: string } = {
    CREATED: 'Surat Dibuat',
    SUBMITTED: 'Surat Diajukan',
    APPROVED: 'Disetujui',
    REJECTED: 'Ditolak',
    REVISED: 'Surat Direvisi',
    REVIEWED: 'Surat Ditinjau',
    REVISION_REQUESTED: 'Permintaan Revisi'
  }
  return actions[action] || action
}

export default function ProcurementProgressPage() {
  const params = useParams()
  const { letterId } = params
  const { data: ProcurementProgress, isLoading: loadingProgress, error: progressError } = useGetProgress(String(letterId))
  const {
    data: letterBlob,
    isLoading: isPdfLoading,
    error: pdfError
  } = useGetProcurementLetterFile(ProcurementProgress?.letter.letterFile?.split('/')?.pop() || '')
  console.log(letterBlob)

  const progress = ProcurementProgress || null
  if (loadingProgress || isPdfLoading) return <DynamicSkeleton variant="fullPageLoader" />
  if (progressError)
    return <div className="container mx-auto p-4">Error: {progressError instanceof Error ? progressError.message : 'Unknown error'}</div>
  if (pdfError) return <div className="container mx-auto p-4">Error: {pdfError instanceof Error ? pdfError.message : 'Unknownnnn error'}</div>

  const sortedLogs = progress?.logs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  return (
    <div className="container flex xl:flex-row flex-col mx-auto w-full gap-8 space-y-8 p-4 md:p-8">
      <div className="flex flex-col min-w-1/2 gap-8">
        {/* Bagian 1: Detail Utama Surat */}
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-2xl">{ProcurementProgress?.letter.letterNumber}</CardTitle>
                <CardDescription className="mt-1">Detail informasi surat pengadaan</CardDescription>
              </div>
              <Badge variant={getStatusBadgeVariant(String(ProcurementProgress?.letter.status))} className="mt-2 w-fit sm:mt-0">
                {ProcurementProgress?.letter.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg line-clamp-1 font-medium leading-relaxed mb-6">{ProcurementProgress?.letter.letterAbout}</p>
            <Separator />
            <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Nominal Pengajuan</p>
                <p className="text-lg font-semibold">{formatCurrency(Number(ProcurementProgress?.letter.nominal))}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Unit Usaha</p>
                <p>{ProcurementProgress?.letter.unit.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Dibuat Oleh</p>
                <p>{ProcurementProgress?.letter.createdBy.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Penyetuju Saat Ini</p>
                <p>{ProcurementProgress?.letter.currentApprover?.name ?? 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Tanggal Dibuat</p>
                <p>{formatDateID(String(ProcurementProgress?.letter.createdAt))}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Terakhir Diperbarui</p>
                <p>{formatDateID(String(ProcurementProgress?.letter.updatedAt))}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bagian 2: Riwayat Proses (Timeline Progress) */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Proses Surat</CardTitle>
            <CardDescription>Linimasa semua tindakan yang tercatat pada surat ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {(sortedLogs ?? []).map((log, index) => (
                <div key={log.logId} className="flex">
                  {/* Bagian Kiri: Ikon dan Garis Vertikal */}
                  <div className="flex flex-col items-center mr-6">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${getLogColor(log.action)}`}>
                      {getLogIcon(log.action)}
                    </div>
                    {index < (sortedLogs ?? []).length - 1 && <div className="w-px flex-grow bg-border" />}
                  </div>
                  {/* Bagian Kanan: Konten Log */}
                  <div className="flex-1 pb-8">
                    {/* --- BLOK HEADER LOG YANG DIPERBAIKI --- */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                      {/* Kiri: Judul Aksi dan Aktor */}
                      <div>
                        <p className="font-semibold text-base">{formatLogAction(log.action)}</p>
                        <p className="text-sm text-muted-foreground -mt-1">oleh {log.actor.name}</p>
                      </div>

                      {/* Kanan: Timestamp */}
                      <p className="text-xs text-muted-foreground mt-1 sm:mt-0 pt-1">{formatDateID(log.timestamp, true)}</p>
                    </div>

                    {/* Komentar (tetap sama) */}
                    {log.comment && (
                      <div className="mt-2 rounded-md border bg-muted/50 p-3">
                        <p className="text-sm text-foreground">{log.comment}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <PdfViewer fileBlob={letterBlob} className="h-[600px] w-full" />
    </div>
  )
}
