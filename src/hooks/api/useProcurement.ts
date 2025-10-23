'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '@/types/api/api'
import { ProcurementsParams, CreateProcurementRequest, ProcessDecisionRequest, UpdateProcurementRequest } from '@/types/api/procurementType'
import {
  getProcurements,
  processDecision,
  createProcurement,
  updateProcurement,
  getProcurementDetails,
  getHistoryProcurements,
  getProcurementProgress,
  getProcurementLetterFile,
  getDashboardProcurements
} from '@/services/ProcurementServices'

const procurementQueryKeys = {
  all: ['procurements'] as const,
  lists: () => [...procurementQueryKeys.all, 'list'] as const,
  list: (params: ProcurementsParams) => [...procurementQueryKeys.lists(), params] as const
}

const historyProcurementQueryKeys: {
  all: readonly ['historyProcurements']
  lists: () => readonly ['historyProcurements', 'list']
  list: (params: ProcurementsParams) => readonly ['historyProcurements', 'list', ProcurementsParams]
} = {
  all: ['historyProcurements'] as const,
  lists: () => [...historyProcurementQueryKeys.all, 'list'] as const,
  list: (params: ProcurementsParams) => [...historyProcurementQueryKeys.lists(), params] as const
}

const procurementLetterFileKeys = {
  all: ['procurementLetterFile'] as const,
  detail: (fileName: string) => [...procurementLetterFileKeys.all, fileName] as const
}

const customRetry = (failureCount: number, error: unknown) => {
  const apiError = error as ApiError
  if (apiError.code && ['401', '403', '404'].includes(String(apiError.code))) return false
  return failureCount < 3
}

/**
 * Hook untuk mengambil daftar pengadaan untuk dashboard.
 */
export function useGetDashboardProcurements() {
  return useQuery({
    queryKey: ['dashboardProcurements'],
    queryFn: () => getDashboardProcurements(),
    staleTime: 5 * 60 * 1000,
    retry: customRetry
  })
}

/**
 * Hook untuk mengambil daftar pengadaan (surat masuk).
 */
export function useGetProcurements(params: ProcurementsParams = {}) {
  return useQuery({
    queryKey: procurementQueryKeys.list(params),
    queryFn: () => getProcurements(params),
    staleTime: 5 * 60 * 1000,
    retry: customRetry
  })
}

/**
 * Hook untuk mendapatkan progress pengadaan tanpa login.
 */
export function useGetProgress(letterId: string) {
  return useQuery({
    queryKey: ['progress', letterId],
    queryFn: () => getProcurementProgress(letterId),
    staleTime: 5 * 60 * 1000,
    retry: customRetry
  })
}

/**
 * Hook untuk mengambil riwayat pengadaan (surat masuk) milik user yang sedang login.
 */
export function useGetUserProcurementHistory(params: ProcurementsParams = {}) {
  return useQuery({
    queryKey: historyProcurementQueryKeys.list(params),
    queryFn: () => getHistoryProcurements(params),
    staleTime: 5 * 60 * 1000,
    retry: customRetry
  })
}

/**
 * Hook untuk mengubah detail pengadaan.
 */
export function useUpdateProcurement(letterId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateProcurementRequest) => updateProcurement(letterId, data),
    onSuccess: () => {
      // Invalidate query list agar data di tabel/dashboard diperbarui
      queryClient.invalidateQueries({ queryKey: procurementQueryKeys.lists() })
    }
  })
}

/**
 * Hook untuk mengambil detail pengadaan.
 */
export function useGetProcurementDetails(letterId: string) {
  return useQuery({
    queryKey: [...procurementQueryKeys.all, letterId],
    queryFn: () => getProcurementDetails(letterId),
    staleTime: 5 * 60 * 1000,
    retry: customRetry
  })
}

/**
 * Hook untuk mengambil file surat pengadaan.
 * Data yang dikembalikan adalah Blob.
 */
export function useGetProcurementLetterFile(fileName: string | undefined) {
  return useQuery({
    queryKey: procurementLetterFileKeys.detail(fileName!),
    queryFn: () => getProcurementLetterFile(fileName!),

    enabled: !!fileName,

    staleTime: Infinity,
    retry: false
  })
}

/**
 * Hook untuk membuat pengadaan baru.
 */
export function useCreateProcurement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateProcurementRequest) => createProcurement(data),
    onSuccess: () => {
      // Invalidate query list agar data di tabel/dashboard diperbarui
      queryClient.invalidateQueries({ queryKey: procurementQueryKeys.lists() })
    }
  })
}

/**
 * Hook untuk memproses keputusan (Approve, Reject, Revise).
 */
export function useProcessDecision(letterId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ProcessDecisionRequest) => processDecision(letterId, data),
    onSuccess: () => {
      // Setelah keputusan dikirim, segarkan kembali daftar pengadaan
      queryClient.invalidateQueries({ queryKey: procurementQueryKeys.lists() })
    }
  })
}
