import axiosInstance from '@/lib/axios'
import { normalizePaginatedResponse } from '@/lib/apiTableHelper'
import type { ApiError, PaginatedResponse, RawPaginatedResponse } from '@/types/api/api'
import type {
  Procurement,
  ProcurementsParams,
  ProcessDecisionRequest,
  CreateProcurementRequest,
  UpdateProcurementRequest,
  ProcurementHistoryLog,
  ProcurementProgress
} from '@/types/api/procurementType'

const normalizeError = (error: unknown, defaultMsg: string, defaultCode: string): ApiError => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const err = error as { response?: { data?: { errors?: string; code?: string; details?: unknown } } }
    return { message: err.response?.data?.errors || defaultMsg, code: err.response?.data?.code || defaultCode, details: err.response?.data?.details }
  }
  return { message: defaultMsg, code: defaultCode, details: undefined }
}

/**
 * Mengambil daftar pengadaan (surat masuk) untuk dashboard.
 */
export const getProcurements = async (params: ProcurementsParams): Promise<PaginatedResponse<Procurement>> => {
  try {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.search) searchParams.set('search', params.search)

    const response = await axiosInstance.get<RawPaginatedResponse<Procurement>>(`/admin/procurements?${searchParams.toString()}`)
    return normalizePaginatedResponse(response.data)
  } catch (error) {
    throw normalizeError(error, 'Gagal mengambil data pengadaan', 'GET_PROCUREMENTS_ERROR')
  }
}

/**
 * Mengambil daftar pengadaan (surat masuk) untuk dashboard.
 */
export const getHistoryProcurements = async (params: ProcurementsParams): Promise<PaginatedResponse<ProcurementHistoryLog>> => {
  try {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.search) searchParams.set('search', params.search)

    const response = await axiosInstance.get<RawPaginatedResponse<ProcurementHistoryLog>>(`/admin/procurements/history?${searchParams.toString()}`)
    return normalizePaginatedResponse(response.data)
  } catch (error) {
    throw normalizeError(error, 'Gagal mengambil data history pengadaan', 'GET_HISTORY_PROCUREMENTS_ERROR')
  }
}

/**
 * Mengambil progress pengadaan berdasarkan ID surat tanpa login.
 */
export const getProcurementProgress = async (letterId: string): Promise<ProcurementProgress> => {
  try {
    const response = await axiosInstance.get<{ data: ProcurementProgress }>(`/progress/${letterId}`)
    return response.data.data
  } catch (error) {
    throw normalizeError(error, 'Gagal mengambil progress pengadaan', 'GET_PROGRESS_ERROR')
  }
}

/**
 * Mengubah detail pengadaan.
 */
export const updateProcurement = async (letterId: string, data: UpdateProcurementRequest): Promise<Procurement> => {
  try {
    const formData = new FormData()
    formData.append('letterNumber', data.letterNumber)
    formData.append('letterAbout', data.letterAbout)
    formData.append('nominal', String(data.nominal))
    formData.append('incomingLetterDate', data.incomingLetterDate)
    formData.append('unitId', data.unitId)
    if (data.letterFile) {
      formData.append('letter_file', data.letterFile)
    }

    const response = await axiosInstance.put(`/admin/procurements/${letterId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data.data
  } catch (error) {
    throw normalizeError(error, 'Gagal mengubah pengadaan', 'UPDATE_PROCUREMENT_ERROR')
  }
}

/**
 * Mengambil detail pengadaan berdasarkan ID surat.
 */
export const getProcurementDetails = async (letterId: string): Promise<Procurement> => {
  try {
    const response = await axiosInstance.get<{ data: Procurement }>(`/admin/procurements/${letterId}`)
    return response.data.data
  } catch (error) {
    throw normalizeError(error, 'Gagal mengambil detail pengadaan', 'GET_PROCUREMENT_DETAILS_ERROR')
  }
}

/**
 * Membuat pengadaan baru (dengan upload file).
 */
export const createProcurement = async (data: CreateProcurementRequest): Promise<Procurement> => {
  try {
    const formData = new FormData()

    // Ubah data JSON menjadi FormData
    formData.append('letterNumber', data.letterNumber)
    formData.append('letterAbout', data.letterAbout)
    formData.append('nominal', String(data.nominal))
    formData.append('incomingLetterDate', data.incomingLetterDate)
    formData.append('unitId', data.unitId)
    if (data.letterFile) {
      formData.append('letter_file', data.letterFile)
    }

    const response = await axiosInstance.post('/admin/procurements', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data.data
  } catch (error) {
    throw normalizeError(error, 'Gagal membuat pengadaan baru', 'CREATE_PROCUREMENT_ERROR')
  }
}

export const processDecision = async (letterId: string, data: ProcessDecisionRequest): Promise<Procurement> => {
  try {
    const response = await axiosInstance.post(`/admin/procurements/decision/${letterId}`, data)
    return response.data.data
  } catch (error) {
    throw normalizeError(error, 'Gagal mengirim keputusan', 'PROCESS_DECISION_ERROR')
  }
}

export const getProcurementLetterFile = async (fileName: string): Promise<Blob> => {
  try {
    const response = await axiosInstance.get(`/letters/${fileName}`, {
      responseType: 'blob'
    })
    // axios akan menempatkan Blob di dalam 'response.data'
    return response.data
  } catch (error) {
    throw normalizeError(error, 'Gagal mengunduh file', 'GET_FILE_ERROR')
  }
}
