<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'

const route = useRoute()
const { fetchAll } = useMasterData()

useHead({
  title: 'Edit product • Dashboard'
})

const {
  getProductById,
  updateProduct,
  loading
} = useProductApi()

const product = ref()

const fetchDetail = async () => {
  try {
    const res = await getProductById(
      route.params.id as string
    )

    const data = res.data

    product.value = {
      ...data.product,

      // seoTag API string
      seoTag: data.product.seoTag
        ? [data.product.seoTag]
        : [],

      // variants -> unique colors
      colors: [
        ...new Set(
          data.variants.map(
            (v: any) => v.color
          )
        )
      ],

      // variants -> unique sizes
      sizes: [
        ...new Set(
          data.variants.map(
            (v: any) => v.size
          )
        )
      ],

      categoryIds: [
        ...new Set(data.categoryIds)
      ],

      // cover images
      coverImages:
        data.coverImages.map(
          (i: any) => i.imageUrl
        ),

      // links
      links: data.links || []
    }

  } catch (err: any) {
    message.error(
      err?.message ||
      'Failed fetch product'
    )
  }
}

const handleUpdate = async (
  payload: any
) => {
  try {
    await updateProduct(
      route.params.id as string,
      payload
    )

    message.success(
      'Product updated successfully'
    )

    navigateTo('/products')

  } catch (err: any) {
    message.error(
      err?.message ||
      'Failed update product'
    )
  }
}

onMounted(async () => {
  await fetchAll()
})

onMounted(fetchDetail)
</script>

<template>
  <ProductForm
    mode="edit"
    :initial-values="product"
    :loading="loading"
    @submit="handleUpdate"
  />
</template>