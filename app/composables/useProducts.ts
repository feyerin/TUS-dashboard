import { ref } from 'vue'

const PRODUCT_URL =
  '/api/v1/private/product'

const UPLOAD_URL =
  '/api/v1/private/upload'

export function useProductApi() {
  const { $api } = useNuxtApp()

  const loading = ref(false)
  const uploading = ref(false)
  const error = ref<any>(null)

  // ================= GET PRODUCTS =================
  const getProducts = async (
    params?: any
  ) => {
    loading.value = true
    error.value = null

    try {
      const res: any = await $api(
        PRODUCT_URL,
        {
          method: 'GET',
          params
        }
      )

      return res

    } catch (err) {
      error.value = err
      throw err

    } finally {
      loading.value = false
    }
  }

  // ================= GET DETAIL =================
  const getProductById = async (
    id: string
  ) => {
    loading.value = true
    error.value = null

    try {
      const res: any = await $api(
        `${PRODUCT_URL}/${id}`,
        {
          method: 'GET'
        }
      )

      return res

    } catch (err) {
      error.value = err
      throw err

    } finally {
      loading.value = false
    }
  }

  // ================= UPLOAD =================
  const uploadFile = async (
    file: File
  ) => {
    uploading.value = true
    error.value = null

    try {
      const formData = new FormData()

      formData.append(
        'file',
        file
      )

      const res: any = await $api(
        UPLOAD_URL,
        {
          method: 'POST',
          body: formData
        }
      )

      return res?.data?.url

    } catch (err) {
      error.value = err
      throw err

    } finally {
      uploading.value = false
    }
  }

  // ================= CREATE =================
  const createProduct = async (
    payload: any
  ) => {
    loading.value = true
    error.value = null

    try {
      return await $api(
        PRODUCT_URL,
        {
          method: 'POST',
          body: payload
        }
      )

    } catch (err) {
      error.value = err
      throw err

    } finally {
      loading.value = false
    }
  }

  // ================= UPDATE =================
  const updateProduct = async (
    id: string,
    payload: any
  ) => {
    loading.value = true
    error.value = null

    try {
      return await $api(
        `${PRODUCT_URL}/${id}`,
        {
          method: 'PUT',
          body: payload
        }
      )

    } catch (err) {
      error.value = err
      throw err

    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    uploading,
    error,

    getProducts,
    getProductById,

    createProduct,
    updateProduct,

    uploadFile
  }
}