export const useUpload = () => {
  const { $api } = useNuxtApp()

  const uploadImage = async (
    file: File
  ) => {
    const formData = new FormData()

    formData.append('file', file)

    return await $api(
      '/api/v1/private/upload',
      {
        method: 'POST',
        body: formData
      }
    )
  }

  return {
    uploadImage
  }
}