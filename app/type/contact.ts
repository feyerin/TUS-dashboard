export interface ApiResponse<T> {
  metadata: {
    path: string
    statusCode: number
    status: string
    messsage: string
    timestamp: string
    requestId: string
  }

  data: T
}

export interface ContactPayload {
  email: string
  hours: string
  phone_number: string
  store: string
}

export interface SocialMediaPayload {
  instagram: string
  facebook: string
  tiktok: string
}