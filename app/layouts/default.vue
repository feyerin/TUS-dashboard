<script setup lang="ts">
const { fetchAll } = useMasterData()

onMounted(async () => {
  const token = localStorage.getItem('access_token')

  if (!token) {
    navigateTo('/login')
    return
  }

  await fetchAll()
})
</script>
<template>
  <div class="flex h-screen bg-gray-100">
    <LayoutsSidebar />

    <div class="flex flex-col flex-1 overflow-hidden">
      <LayoutsTopbar />

      <main class="px-4 pb-6 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>