import axios from 'axios'
import { ref } from 'vue'

export interface User {
  id: string
  name: string
  email: string
  role?: string
  status?: string
  createdAt?: string
  password?: string
}

export interface CreateUserPayload {
  name: string
  email: string
  password: string
  role?: string
  status?: string
}

export interface UpdateUserPayload {
  name?: string
  email?: string
  password?: string
  role?: string
  status?: string
}

const USER_URL =
  '/api/v1/private/user'

export const useUser = () => {
  const config = useRuntimeConfig()

  const loading = ref(false)
  const error = ref<any>(null)

  const getToken = () => {
    if (!import.meta.client) {
      return null
    }

    return localStorage.getItem(
      'access_token'
    )
  }

  const headers = () => ({
    Authorization: `Bearer ${getToken()}`
  })

  // ================= GET USERS =================
  const getUsers = async (
    params?: any
  ) => {
    loading.value = true
    error.value = null

    try {

      const res = await axios.get(
        `${config.public.apiBase}${USER_URL}`,
        {
          headers: headers(),
          params
        }
      )

      return res.data?.users || {}

    } catch (err) {

      error.value = err
      throw err

    } finally {
      loading.value = false
    }
  }

  // ================= GET USER BY ID =================
  const getUserById = async (
    id: string
  ) => {
    loading.value = true
    error.value = null

    try {

      const res = await axios.get(
        `${config.public.apiBase}${USER_URL}/${id}`,
        {
          headers: headers()
        }
      )

      return res.data?.data || {}

    } catch (err) {

      error.value = err
      throw err

    } finally {
      loading.value = false
    }
  }

  // ================= CREATE USER =================
  const createUser = async (
    payload: CreateUserPayload
  ) => {
    loading.value = true
    error.value = null

    try {

      const res = await axios.post(
        `${config.public.apiBase}${USER_URL}`,
        payload,
        {
          headers: headers()
        }
      )

      return res.data

    } catch (err) {

      error.value = err
      throw err

    } finally {
      loading.value = false
    }
  }

  // ================= UPDATE USER =================
  const updateUser = async (
    id: string,
    payload: UpdateUserPayload
  ) => {
    loading.value = true
    error.value = null

    try {

      const res = await axios.put(
        `${config.public.apiBase}${USER_URL}/${id}`,
        payload,
        {
          headers: headers()
        }
      )

      return res.data

    } catch (err) {

      error.value = err
      throw err

    } finally {
      loading.value = false
    }
  }

  // ================= DELETE USER =================
  const deleteUser = async (
    id: string
  ) => {
    loading.value = true
    error.value = null

    try {

      const res = await axios.delete(
        `${config.public.apiBase}${USER_URL}/${id}`,
        {
          headers: headers()
        }
      )

      return res.data

    } catch (err) {

      error.value = err
      throw err

    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,

    getUsers,
    getUserById,

    createUser,
    updateUser,
    deleteUser
  }
}