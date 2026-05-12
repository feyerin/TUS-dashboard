// composables/useSize.ts

export interface Size {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface SizePayload {
  name: string
}

type SizeListResponse = {
  data?: {
    sizes?: Size[]
  }

  pagination?: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
  }
}

export const useSize = () => {
  const { $api } =
    useNuxtApp()

  // ================= GET LIST =================
  const getSizes = async (
    params?: Record<
      string,
      any
    >
  ) => {
    const res =
      (await $api(
        '/api/v1/private/size',
        {
          method: 'GET',
          params
        }
      )) as SizeListResponse

    return {
      sizes:
        res.data?.sizes ||
        [],

      pagination:
        res.pagination
    }
  }

  // ================= GET DETAIL =================
  const getSizeById =
    async (
      id: number | string
    ) => {
      const res =
        await $api(
          `/api/v1/private/size/${id}`,
          {
            method: 'GET'
          }
        )

      return (res as any)
        ?.data
    }

  // ================= CREATE =================
  const createSize =
    async (
      payload: SizePayload
    ) => {
      return await $api(
        '/api/v1/private/size',
        {
          method: 'POST',
          body: payload
        }
      )
    }

  // ================= UPDATE =================
  const updateSize =
    async (
      id: number | string,
      payload: SizePayload
    ) => {
      return await $api(
        `/api/v1/private/size/${id}`,
        {
          method: 'PUT',
          body: payload
        }
      )
    }

  // ================= DELETE =================
  const deleteSize =
    async (
      id: number | string
    ) => {
      return await $api(
        `/api/v1/private/size/${id}`,
        {
          method: 'DELETE'
        }
      )
    }

  return {
    getSizes,
    getSizeById,
    createSize,
    updateSize,
    deleteSize
  }
}