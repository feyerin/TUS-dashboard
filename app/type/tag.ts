// ~/type/tag.ts

export interface Tag {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface TagPayload {
  name: string
}

export interface TagResponse {
  metadata: {
    path: string
    statusCode: number
    status: string
    messsage: string
    timestamp: string
    requestId: string
  }

  data: {
    tags: Tag[]
  }

  pagination: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
  }
}