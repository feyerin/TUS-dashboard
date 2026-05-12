export const useDynamicSection = () => {
  const { $api } = useNuxtApp()

  const DYNAMIC_SECTION_KEY = {
    HERO_BANNER: 'hero_banner',
    RUNNING_TEXT: 'running_text',
    COLLECTION_SECTION: 'collection_section',
    COLLECTION_SECTION_2: 'collection_section_2',
    NEW_ARRIVALS: 'new_arrivals',
    FEATURED_PRODUCTS: 'featured_products'
  }

  const formatTitle = (key: string) => {
    return key
      .split('_')
      .map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(' ')
  }

  const updateSection = async (
    id: string,
    payload: { content: any }
  ) => {
    const sectionTitle = formatTitle(id)

    return await $api(
      `/api/v1/private/dynamic-section/homepage/${id}`,
      {
        method: 'PUT',
        body: {
          config: {},
          content: payload.content,
          isActive: true,
          subtitle: sectionTitle,
          title: sectionTitle
        }
      }
    )
  }

  const getSection = async (id: string) => {
    return await $api(
      `/api/v1/private/dynamic-section/homepage/${id}`,
      {
        method: 'GET'
      }
    )
  }

  return {
    DYNAMIC_SECTION_KEY,
    updateSection,
    getSection
  }
}