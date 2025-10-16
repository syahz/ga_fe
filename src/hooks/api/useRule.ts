'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '@/types/api/api'
import { RulesParams, CreateRuleRequest, UpdateRuleRequest, UpdateRuleStepsRequest } from '@/types/api/ruleType'
import { getRules, getRuleById, createRule, updateRule, updateRuleSteps, deleteRule } from '@/services/RuleServices'

const ruleQueryKeys = {
  all: ['rules'] as const,
  lists: () => [...ruleQueryKeys.all, 'list'] as const,
  list: (params: RulesParams) => [...ruleQueryKeys.lists(), params] as const,
  details: () => [...ruleQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...ruleQueryKeys.details(), id] as const
}

const customRetry = (failureCount: number, error: unknown) => {
  const apiError = error as ApiError
  // Jangan coba lagi jika error karena otentikasi, otorisasi, atau data tidak ditemukan
  if (apiError.code && ['401', '403', '404'].includes(String(apiError.code))) {
    return false
  }
  // Coba lagi maksimal 3 kali untuk error lainnya (misal: error jaringan)
  return failureCount < 3
}

/**
 * Hook untuk mengambil daftar Aturan dengan filter dan paginasi.
 */
export function useGetRules(params: RulesParams = {}) {
  return useQuery({
    queryKey: ruleQueryKeys.list(params),
    queryFn: () => getRules(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    // --- PENAMBAHAN LOGIKA RETRY ---
    retry: customRetry,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 20000)
    // -------------------------------
  })
}

/**
 * Hook untuk mengambil detail satu Aturan berdasarkan ID.
 */
export function useGetRuleById(id: string) {
  return useQuery({
    queryKey: ruleQueryKeys.detail(id),
    queryFn: () => getRuleById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    // --- PENAMBAHAN LOGIKA RETRY ---
    retry: customRetry,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 20000)
    // -------------------------------
  })
}

/**
 * Hook untuk membuat Aturan baru.
 */
export function useCreateRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateRuleRequest) => createRule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ruleQueryKeys.lists() })
    }
  })
}

/**
 * Hook untuk memperbarui detail utama Aturan.
 */
export function useUpdateRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateRuleRequest & { id: string }) => updateRule(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ruleQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ruleQueryKeys.detail(variables.id) })
    }
  })
}

/**
 * Hook untuk memperbarui semua langkah (steps) pada sebuah Aturan.
 */
export function useUpdateRuleSteps() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateRuleStepsRequest & { ruleId: string }) => updateRuleSteps(data),
    onSuccess: (data, variables) => {
      // Setelah update, invalidasi list dan detail agar data baru terambil
      queryClient.invalidateQueries({ queryKey: ruleQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ruleQueryKeys.detail(variables.ruleId) })
    }
  })
}

/**
 * Hook untuk menghapus Aturan.
 */
export function useDeleteRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ruleQueryKeys.all })
    }
  })
}
