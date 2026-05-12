// type/color.ts

export interface Color {
  id: number
  name: string
  hexCode: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface ColorPayload {
  name: string
  hexCode: string
}

export interface ColorListResponse {
  colors: Color[]
  pagination: {
    totalItems: number
    page: number
    limit: number
    totalPages: number
  }
}