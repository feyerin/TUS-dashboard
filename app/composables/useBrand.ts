import type { BrandsQuery, BrandResponse } from '~/type/brand'

export const useBrand = () => {
  const { $api } = useNuxtApp()
  const { brands: masterBrands } = useMasterData()

  // ================= GET LIST =================
  const getBrands = async (params?: BrandsQuery) => {
    const res = await $api<BrandResponse>('/api/v1/private/brand', {
      method: 'GET',
      query: params
    })

    masterBrands.value = res.data?.brands || []

    return res
  }

  // ================= CREATE =================
  const createBrand = async (payload: {
    name: string
    profileImageUrl: string
  }) => {
    return await $api('/api/v1/private/brand', {
      method: 'POST',
      body: payload
    })
  }

  // ================= UPDATE =================
  const updateBrand = async (
    id: string,
    payload: {
      name: string
      profileImageUrl: string
    }
  ) => {
    return await $api(`/api/v1/private/brand/${id}`, {
      method: 'PUT',
      body: payload
    })
  }

  // ================= DELETE =================
  const deleteBrand = async (id: string) => {
    return await $api(`/api/v1/private/brand/${id}`, {
      method: 'DELETE'
    })
  }

  return {
    getBrands,
    createBrand,
    updateBrand,
    deleteBrand
  }
}