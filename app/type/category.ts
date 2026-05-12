export interface Category {
  id: string
  name: string
  slug: string
  parentId?: string
  level: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface CategoryQuery {
  page?: number
  limit?: number
  name?: string
  deleted?: boolean
  orderBy?: string
}

export interface CategoryResponse {
  categories: Category[]
}

export interface ApiResponse<T> {
  data: T
  pagination?: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
  }
}