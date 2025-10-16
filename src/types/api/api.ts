export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface Pagination {
  total_data: number
  page: number
  limit: number
  total_page: number
}

export type RawPaginatedResponse<T> = {
  data: {
    pagination: Pagination
  } & {
    [key: string]: T[]
  }
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: Pagination
}

export interface ApiError {
  message: string
  code?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any
}
