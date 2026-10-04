import { ref } from 'vue'
import type { CollectionResponse } from '~/type/collection'

const COLLECTION_URL = '/api/v1/private/collection'

export function useCollection() {
  const { $api } = useNuxtApp()
  const { collections: masterCollections } = useMasterData()

  const loading = ref(false)
  const error = ref<any>(null)

  // ================= GET LIST =================
  const getCollections = async (params?: any) => {
    loading.value = true
    error.value = null

    try {
      const res = await $api<CollectionResponse>(COLLECTION_URL, {
        method: 'GET',
        params
      })

      masterCollections.value = res.data?.collections || []

      return res
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  // ================= CREATE =================
  const createCollection = async (payload: any) => {
    return await $api(COLLECTION_URL, {
      method: 'POST',
      body: payload
    })
  }

  // ================= UPDATE =================
  const updateCollection = async (id: string, payload: any) => {
    return await $api(`${COLLECTION_URL}/${id}`, {
      method: 'PUT',
      body: payload
    })
  }

  // ================= DELETE =================
  const deleteCollection = async (id: string) => {
    return await $api(`${COLLECTION_URL}/${id}`, {
      method: 'DELETE'
    })
  }

  return {
    loading,
    error,
    getCollections,
    createCollection,
    updateCollection,
    deleteCollection
  }
}