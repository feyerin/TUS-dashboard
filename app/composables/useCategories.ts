import type { CategoryQuery } from '~/type/category'

export const useCategory = () => {
  const { $api } = useNuxtApp()

  // ================= GET =================
  const getCategories = async (params?: CategoryQuery) => {
    const res: any = await $api('/api/v1/private/category', {
      method: 'GET',
      params,
    })

    const data = res?.data

    return {
      categories: data?.categories ?? [],
      total: res?.pagination?.totalItems ?? 0,
    }
  }

  // ================= CREATE =================
  const createCategory = async (payload: { name: string }) => {
    return await $api('/api/v1/private/category', {
      method: 'POST',
      body: payload,
    })
  }

  // ================= UPDATE =================
  const updateCategory = async (
    id: string,
    payload: { name: string }
  ) => {
    return await $api(`/api/v1/private/category/${id}`, {
      method: 'PUT',
      body: payload,
    })
  }

  // ================= DELETE =================
  const deleteCategory = async (id: string) => {
    return await $api(`/api/v1/private/category/${id}`, {
      method: 'DELETE',
    })
  }

  return {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}