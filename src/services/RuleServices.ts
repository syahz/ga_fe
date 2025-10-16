import axiosInstance from '@/lib/axios'
import { CreateRuleRequest, Rule, RulesParams, UpdateRuleRequest, UpdateRuleStepsRequest } from '@/types/api/ruleType'
import { normalizePaginatedResponse } from '@/lib/apiTableHelper'
import type { ApiError, ApiResponse, PaginatedResponse, RawPaginatedResponse } from '@/types/api/api'

/**
 * Fungsi helper untuk normalisasi error dari Axios
 */
const normalizeError = (error: unknown, defaultMsg: string, defaultCode: string): ApiError => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const err = error as { response?: { data?: { errors?: string; code?: string; details?: unknown } } }
    return {
      message: err.response?.data?.errors || defaultMsg,
      code: err.response?.data?.code || defaultCode,
      details: err.response?.data?.details
    }
  }
  return { message: defaultMsg, code: defaultCode, details: undefined }
}

/**
 * Mengambil daftar aturan dengan filter dan paginasi.
 */
export const getRules = async (params: RulesParams = {}): Promise<PaginatedResponse<Rule>> => {
  try {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.search) searchParams.set('search', params.search)

    // Backend mengembalikan { data: { data: [], pagination: {} } }, jadi kita pakai 'any'
    const response = await axiosInstance.get<RawPaginatedResponse<Rule>>(`/admin/rules?${searchParams.toString()}`)
    // Teruskan `response.data` yang berisi `data` dan `pagination`
    return normalizePaginatedResponse(response.data)
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal mengambil data aturan', 'GET_RULES_ERROR')
  }
}

/**
 * Mengambil detail satu aturan berdasarkan ID.
 */
export const getRuleById = async (id: string): Promise<Rule> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Rule>>(`/admin/rules/${id}`)
    return response.data.data
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal mengambil detail aturan', 'GET_RULE_BY_ID_ERROR')
  }
}

/**
 * Membuat aturan baru.
 */
export const createRule = async (data: CreateRuleRequest): Promise<Rule> => {
  try {
    const response = await axiosInstance.post<ApiResponse<Rule>>('/admin/rules', data)
    return response.data.data
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal membuat aturan baru', 'CREATE_RULE_ERROR')
  }
}

/**
 * Memperbarui detail utama (nama, nominal) dari sebuah aturan.
 */
export const updateRule = async ({ id, ...data }: UpdateRuleRequest & { id: string }): Promise<Rule> => {
  try {
    const response = await axiosInstance.put<ApiResponse<Rule>>(`/admin/rules/${id}`, data)
    return response.data.data
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal memperbarui detail aturan', 'UPDATE_RULE_ERROR')
  }
}

/**
 * Memperbarui semua langkah (steps) dari sebuah aturan.
 */
export const updateRuleSteps = async ({ ruleId, ...data }: UpdateRuleStepsRequest & { ruleId: string }): Promise<Rule> => {
  try {
    const response = await axiosInstance.put<ApiResponse<Rule>>(`/admin/rules/step/${ruleId}`, data)
    return response.data.data
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal memperbarui langkah persetujuan', 'UPDATE_RULE_STEPS_ERROR')
  }
}

/**
 * Menghapus aturan berdasarkan ID.
 */
export const deleteRule = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/admin/rules/${id}`)
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal menghapus aturan', 'DELETE_RULE_ERROR')
  }
}
