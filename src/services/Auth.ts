import axiosInstance from '@/lib/axios'
import type { ApiError } from '@/types/api/api'
import type { LoginRequest, LoginResponse, LogoutResponse } from '@/types/api/auth'

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', data)
    return response.data
  } catch (error: unknown) {
    let apiError: ApiError
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: { message?: string; code?: string; details?: unknown } } }
      apiError = {
        message: err.response?.data?.message || 'Failed to login',
        code: err.response?.data?.code || 'LOGIN_ERROR',
        details: err.response?.data?.details
      }
    } else {
      apiError = {
        message: 'Failed to login',
        code: 'LOGIN_ERROR',
        details: undefined
      }
    }
    throw apiError
  }
}

export const logout = async (): Promise<LogoutResponse> => {
  try {
    // Gunakan metode .delete() sesuai dengan route di backend
    const response = await axiosInstance.delete<LogoutResponse>('/auth/logout')
    return response.data
  } catch (error: unknown) {
    let apiError: ApiError
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: { message?: string; code?: string; details?: unknown } } }
      apiError = {
        message: err.response?.data?.message || 'Failed to logout',
        code: err.response?.data?.code || 'LOGOUT_ERROR',
        details: err.response?.data?.details
      }
    } else {
      apiError = {
        message: 'Failed to logout',
        code: 'LOGOUT_ERROR',
        details: undefined
      }
    }
    throw apiError
  }
}
