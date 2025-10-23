'use client'

import { login, logout } from '@/services/Auth'
import type { LoginRequest } from '@/types/api/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: () => {
      // Refetch users list secara otomatis
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}
