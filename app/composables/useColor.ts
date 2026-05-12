import type { ApiResponse } from "~/type/category"
import type { Color, ColorPayload, ColorListResponse } from "~/type/color"

export const useColor = () => {
  const { $api } = useNuxtApp()

  // ================= GET LIST =================
  const getColors = async (
    params?: any
  ): Promise<ApiResponse<ColorListResponse>> => {
    return await $api('/api/v1/private/color', {
      method: 'GET',
      params,
    })
  }

  // ================= GET DETAIL =================
  const getColorById = (
    id: number | string
  ): Promise<ApiResponse<Color>> => {
    return $api(`/api/v1/private/color/${id}`, {
      method: 'GET',
    })
  }

  // ================= CREATE =================
  const createColor = (
    payload: ColorPayload
  ): Promise<ApiResponse<Color>> => {
    return $api('/api/v1/private/color', {
      method: 'POST',
      body: payload,
    })
  }

  // ================= UPDATE =================
  const updateColor = (
    id: number | string,
    payload: ColorPayload
  ): Promise<ApiResponse<Color>> => {
    return $api(`/api/v1/private/color/${id}`, {
      method: 'PUT',
      body: payload,
    })
  }

  // ================= DELETE =================
  const deleteColor = (
    id: number | string
  ): Promise<ApiResponse<null>> => {
    return $api(`/api/v1/private/color/${id}`, {
      method: 'DELETE',
    })
  }

  return {
    getColors,
    getColorById,
    createColor,
    updateColor,
    deleteColor,
  }
}