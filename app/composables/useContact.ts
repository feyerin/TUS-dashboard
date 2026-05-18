import type {ApiResponse, ContactPayload, SocialMediaPayload } from "~/type/contact"

export const useSetting = () => {
  const { $api } = useNuxtApp()

  // ================= CONTACT =================
  const getContact = async (): Promise<ContactPayload> => {
    const response = await $api<ApiResponse<ContactPayload>>(
      '/api/v1/private/contact',
      {
        method: 'GET'
      }
    )

    return response.data
  }

  const updateContact = async (
    payload: ContactPayload
  ) => {
    return await $api(
      '/api/v1/private/contact',
      {
        method: 'PUT',
        body: payload
      }
    )
  }

  // ================= SOCIAL =================
  const getSocialMedia = async (): Promise<SocialMediaPayload> => {
    const response = await $api<ApiResponse<SocialMediaPayload>>(
      '/api/v1/private/social-media',
      {
        method: 'GET'
      }
    )

    return response.data
  }

  const updateSocialMedia = async (
    payload: SocialMediaPayload
  ) => {
    return await $api(
      '/api/v1/private/social-media',
      {
        method: 'PUT',
        body: payload
      }
    )
  }

  return {
    getContact,
    updateContact,

    getSocialMedia,
    updateSocialMedia
  }
}