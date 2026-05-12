import type {
  BrandsQuery,
  BrandResponse
} from '~/type/brand'

export const useBrand = () => {
  const { $api } = useNuxtApp()

  const getBrands = async (
    params?: BrandsQuery
  ) => {
    return await $api<BrandResponse>(
      '/api/v1/private/brand',
      {
        method: 'GET',
        query: params
      }
    )
  }

  const createBrand = async (
    payload: {
      name: string
      profileImageUrl: string
    }
  ) => {
    return await $api(
      '/api/v1/private/brand',
      {
        method: 'POST',
        body: payload
      }
    )
  }

  const updateBrand = async (
    id: string,
    payload: {
      name: string
      profileImageUrl: string
    }
  ) => {
    return await $api(
      `/api/v1/private/brand/${id}`,
      {
        method: 'PUT',
        body: payload
      }
    )
  }

  const deleteBrand = async (
    id: string
  ) => {
    return await $api(
      `/api/v1/private/brand/${id}`,
      {
        method: 'DELETE'
      }
    )
  }

  return {
    getBrands,
    createBrand,
    updateBrand,
    deleteBrand
  }
}