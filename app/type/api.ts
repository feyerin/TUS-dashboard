export interface ApiPagination {
  totalItems?: number
  totalPages?: number
  page?: number
  limit?: number
}

export interface ApiResponse<T> {
  data: T
  pagination?: ApiPagination
  message?: string
  status?: string
}