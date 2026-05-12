<script setup lang="ts">
useHead({
  title: 'Create Product'
})

const {
  createProduct,
  loading
} = useProductApi()

const handleCreate = async (
  payload: any
) => {
  try {
    await createProduct(payload)

    message.success(
      'Product created successfully'
    )

    navigateTo('/products')

  } catch (err: any) {
    message.error(
      err?.message ||
      'Failed create product'
    )
  }
}
</script>

<template>
  <ProductForm
    :loading="loading"
    @submit="handleCreate"
  />
</template>