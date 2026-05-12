export interface BrandsQuery {
  page?: number
  limit?: number
  search?: string
  deleted?: boolean
}

export interface BrandItem {
  id: string
  name: string
  slug: string
  profileImageUrl: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  createdBy?: string
}

export interface BrandResponse {
  metadata: {
    path: string
    statusCode: number
    status: string
    messsage: string
    timestamp: string
    requestId: string
  }

  data: {
    brands: BrandItem[]
  }

  pagination: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
  }
}