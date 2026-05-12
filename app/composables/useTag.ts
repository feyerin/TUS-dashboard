// ~/composables/useTag.ts

import type { GetTagsQuery, TagResponse, TagPayload } from "~/type/tag"



export const useTag = () => {
  const { $api } = useNuxtApp()

  // ================= GET =================
  const getTags = async (
    params?: GetTagsQuery
  ): Promise<TagResponse> => {
    return await $api(
      '/api/v1/private/tag',
      {
        method: 'GET',
        query: params
      }
    )
  }

  // ================= CREATE =================
  const createTag = async (
    payload: TagPayload
  ) => {
    return await $api(
      '/api/v1/private/tag',
      {
        method: 'POST',
        body: payload
      }
    )
  }

  // ================= UPDATE =================
  const updateTag = async (
    id: string,
    payload: TagPayload
  ) => {
    return await $api(
      `/api/v1/private/tag/${id}`,
      {
        method: 'PUT',
        body: payload
      }
    )
  }

  // ================= DELETE =================
  const deleteTag = async (
    id: string
  ) => {
    return await $api(
      `/api/v1/private/tag/${id}`,
      {
        method: 'DELETE'
      }
    )
  }

  return {
    getTags,
    createTag,
    updateTag,
    deleteTag
  }
}