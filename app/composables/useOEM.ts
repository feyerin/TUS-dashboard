
export interface OemProduct {
  productName: string
  description: string
  image: string
}

export interface OemSectionPayload {
  content: OemProduct[]
  subtitle: string
  title: string
}

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

export const useOemSection = () => {
  const { $api } = useNuxtApp()

  const getOemSection = async (): Promise<OemSectionPayload> => {
    const response = await $api<ApiResponse<OemSectionPayload>>(
      '/api/v1/private/dynamic-section/homepage/oem',
      { method: 'GET' }
    )

    return response.data
  }

  const createOemSection = async (payload: OemSectionPayload) => {
    return await $api<ApiResponse<OemSectionPayload>>(
      '/api/v1/private/dynamic-section/homepage/oem',
      {
        method: 'POST',
        body: payload,
      }
    )
  }

  const updateOemSection = async (payload: OemSectionPayload) => {
    return await $api<ApiResponse<OemSectionPayload>>(
      '/api/v1/private/dynamic-section/homepage/oem',
      {
        method: 'PUT',
        body: payload,
      }
    )
  }

  return {
    getOemSection,
    createOemSection,
    updateOemSection,
  }
}
