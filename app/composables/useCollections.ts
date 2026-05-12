import { ref } from 'vue'

const COLLECTION_URL = '/api/v1/private/collection'

export function useCollection() {
  const { $api } = useNuxtApp()

  const loading = ref(false)
  const error = ref<any>(null)

  // GET LIST
  const getCollections = async (params?: any) => {
    loading.value = true
    error.value = null

    try {
      return await $api(COLLECTION_URL, {
        method: 'GET',
        params
      })
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  // CREATE
  const createCollection = async (payload: any) => {
    return await $api(COLLECTION_URL, {
      method: 'POST',
      body: payload
    })
  }

  // UPDATE
  const updateCollection = async (id: string, payload: any) => {
    return await $api(`${COLLECTION_URL}/${id}`, {
      method: 'PUT',
      body: payload
    })
  }

  // DELETE
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