<template>
  <header
    class="m-4 h-16 bg-white border border-gray-100 rounded-full shadow-sm
    flex items-center justify-between px-4 md:px-6"
  >

    <!-- LEFT -->
    <div class="flex items-center gap-3">

      <!-- MOBILE MENU BUTTON -->
      <button
        class="md:hidden p-2 rounded-xl hover:bg-gray-100 transition"
        @click="$emit('toggle-sidebar')"
      >
        <Icon name="lucide:menu" />
      </button>

      <!-- LOGO -->
      <img
        src="/img/tus.PNG"
        alt="Logo"
        class="h-10 w-20 md:w-24 object-contain"
      />

    </div>

    <!-- RIGHT -->
    <div class="flex items-center gap-3 md:gap-4">

      <!-- NOTIFICATION -->
      <button class="p-2 rounded-xl hover:bg-gray-100 transition relative">
        <Icon name="lucide:bell" class="text-lg" />
        <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      <!-- USER -->
      <a-dropdown placement="bottomRight">
        <div
          class="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md transition"
        >
          <div class="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
            <img src="https://i.pravatar.cc/100" alt="avatar" />
          </div>

          <!-- HIDE TEXT ON SMALL SCREEN -->
          <div class="hidden md:block text-sm mt-2">
            <span class="font-medium leading-tight">Admin</span>
            <p class="text-xs text-gray-400">Superuser</p>
          </div>
        </div>

        <template #overlay>
          <a-menu>
            <a-menu-item key="logout" @click="handleLogout">
              <div class="flex items-center gap-2 text-red-500">
                <Icon name="lucide:log-out" />
                Logout
              </div>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>

    </div>

  </header>
</template>

<script setup lang="ts">
const emit = defineEmits(['toggle-sidebar'])

const handleLogout = () => {
  localStorage.removeItem('token')
  navigateTo('/login')
}
</script>