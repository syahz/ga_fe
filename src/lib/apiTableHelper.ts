// lib/api-helpers.ts
import type { RawPaginatedResponse, PaginatedResponse } from '@/types/api/api'

export function normalizePaginatedResponse<T>(raw: RawPaginatedResponse<T>): PaginatedResponse<T> {
  const { data } = raw
  // ambil field array pertama (misal "user" atau "business_entities")
  const [items] = Object.values(data).filter(Array.isArray) as T[][]

  return {
    items: items || [],
    pagination: data.pagination
  }
}
