
import { ref } from 'vue'

const categories = ref<any[]>([])
const colors = ref<any[]>([])
const sizes = ref<any[]>([])
const brands = ref<any[]>([])
const collections = ref<any[]>([])
const tags = ref<any[]>([])

const loaded = ref(false)

type CategoryResponse = {
  data?: {
    categories?: any[]
  }
}

type ColorResponse = {
  data?: {
    colors?: any[]
  }
}

type SizeResponse = {
  data?: {
    sizes?: any[]
  }
}

type BrandResponse = {
  data?: {
    brands?: any[]
  }
}

type CollectionResponse = {
  data?: {
    collections?: any[]
  }
}

type TagResponse = {
  data?: {
    tags?: any[]
  }
}

export const useMasterData = () => {
  const { $api } = useNuxtApp()

  const fetchAll = async (force = false) => {
    if (loaded.value && !force) return

    try {
      const [
        catRes,
        colorRes,
        sizeRes,
        brandRes,
        collectionRes,
        tagRes
      ] = await Promise.all([
        $api('/api/v1/private/category', {
          method: 'GET'
        }),

        $api('/api/v1/private/color', {
          method: 'GET',
          query: { page: 1, limit: 1000 }
        }),

        $api('/api/v1/private/size', {
          method: 'GET',
          query: { page: 1, limit: 1000 }
        }),

        $api('/api/v1/private/brand', {
          method: 'GET',
          query: { page: 1, limit: 1000 }
        }),

        $api('/api/v1/private/collection', {
          method: 'GET',
          query: { page: 1, limit: 1000 }
        }),

        $api('/api/v1/private/tag', {
          method: 'GET',
          query: { page: 1, limit: 1000 }
        })
      ])

      categories.value =
        (catRes as CategoryResponse)
          .data?.categories || []

      colors.value =
        (colorRes as ColorResponse)
          .data?.colors || []

      sizes.value =
        (sizeRes as SizeResponse)
          .data?.sizes || []

      brands.value =
        (brandRes as BrandResponse)
          .data?.brands || []

      collections.value =
        (
          collectionRes as CollectionResponse
        ).data?.collections || []

      tags.value =
        (tagRes as TagResponse)
          .data?.tags || []

      loaded.value = true
    } catch (err) {
      console.error(
        'Failed preload master data',
        err
      )
    }
  }

  return {
    categories,
    colors,
    sizes,
    brands,
    collections,
    tags,
    fetchAll
  }
}