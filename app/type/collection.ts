export interface CollectionItem {
  id: string
  name: string
  slug: string
  rank: number

  createdAt: string
  updatedAt: string

  deletedAt: string | null

  createdBy?: string
}

export interface CollectionPagination {
  page: number
  limit: number
  totalItems: number
  totalPages: number
}

export interface CollectionResponse {
  metadata: {
    path: string
    statusCode: number
    status: string
    messsage: string
    timestamp: string
    requestId: string
  }

  data: {
    collections: CollectionItem[]
  }

  pagination: CollectionPagination
}