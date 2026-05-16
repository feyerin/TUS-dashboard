<script setup lang="ts">
import {
  reactive,
  ref,
  computed,
  watch
} from 'vue'

import { useRoute } from 'vue-router'

const route = useRoute()

const collapsed = ref(false)
const mobileOpen = ref(false)

const hoveredMenu = ref('')

const sidebarMenu = [
  {
    label: 'Dashboard',
    icon: 'lucide:layout-dashboard',
    to: '/',
    type: 'item'
  },

  {
    label: 'Products',
    icon: 'lucide:box',
    type: 'group',
    children: [
      {
        label: 'All Products',
        to: '/products'
      },
      {
        label: 'Collections',
        to: '/products/collections'
      },
      {
        label: 'Categories',
        to: '/products/categories'
      },
      {
        label: 'Brands',
        to: '/products/brands'
      }
    ]
  },

  {
    label: 'Product Setup',
    icon: 'lucide:settings-2',
    type: 'group',
    children: [
      {
        label: 'Sizes',
        to: '/setup/sizes'
      },
      {
        label: 'Colors',
        to: '/setup/colors'
      },
      {
        label: 'Tags',
        to: '/setup/tags'
      }
    ]
  },

  {
    label: 'Customers',
    icon: 'lucide:users',
    type: 'group',
    children: [
      {
        label: 'Customer List',
        to: '/customers'
      }
    ]
  },

  {
    label: 'Settings',
    icon: 'lucide:settings',
    type: 'group',
    children: [
      {
        label: 'Homepage',
        to: '/settings/homepage'
      },
      {
        label: 'General',
        to: '/settings/general'
      },
      {
        label: 'Users',
        to: '/settings/users'
      }
    ]
  }
]

const menu = sidebarMenu

const currentPath = computed(
  () => route.path
)

const open = reactive<
  Record<string, boolean>
>({})

const toggle = (key: string) => {
  open[key] = !open[key]
}

const isActive = (path?: string) => {
  return currentPath.value === path
}

const isParentActive = (
  children?: any[]
) => {
  return children?.some(
    c => c.to === currentPath.value
  )
}

/**
 * AUTO OPEN ACTIVE GROUP
 */
watch(
  () => currentPath.value,
  () => {
    menu.forEach((item: any) => {
      if (item.children) {
        open[item.label] =
          item.children.some(
            (c: any) =>
              c.to === currentPath.value
          )
      }
    })

    mobileOpen.value = false
  },
  { immediate: true }
)
</script>

<template>
  <aside
    :class="[
      'fixed md:relative inset-y-0 left-0 z-50 bg-white border-r border-gray-100 shadow-xl transition-all duration-300 flex flex-col m-4 rounded-3xl',
      collapsed ? 'w-20' : 'w-72',
      mobileOpen
        ? 'translate-x-0'
        : '-translate-x-full md:translate-x-0'
    ]"
  >
    <!-- HEADER -->
    <div
      class="h-16 px-4 border-b flex items-center"
      :class="
        collapsed
          ? 'justify-center'
          : 'justify-between'
      "
    >
      <Transition name="fade">
        <span
          v-if="!collapsed"
          class="text-2xl font-bold tracking-tight whitespace-nowrap"
        >
          Dashboard
      </span>
      </Transition>

      <button
        @click="collapsed = !collapsed"
        class="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition shrink-0"
      >
        <Icon
          name="lucide:panel-left-close"
          class="text-xl transition-transform duration-300"
          :class="
            collapsed && 'rotate-180'
          "
        />
      </button>
    </div>

    <!-- NAVIGATION -->
    <nav
      class="flex-1 overflow-visible px-3 py-4 space-y-2"
    >
      <template
        v-for="item in menu"
        :key="item.label"
      >
        <!-- SINGLE -->
        <NuxtLink
          v-if="item.type === 'item'"
          :to="item.to"
          class="nav-item"
          :class="[
            isActive(item.to) &&
              'active',
            collapsed &&
              'justify-center px-0'
          ]"
        >
          <Icon
            :name="item.icon"
            class="text-[20px] shrink-0"
          />

          <span
            v-if="!collapsed"
            class="truncate"
          >
            {{ item.label }}
          </span>
        </NuxtLink>

        <!-- GROUP -->
        <div
          v-else
          class="relative"
          @mouseenter="
            hoveredMenu = item.label
          "
          @mouseleave="
            hoveredMenu = ''
          "
        >
          <button
            @click="toggle(item.label)"
            class="nav-item w-full"
            :class="[
              isParentActive(
                item.children
              ) && 'active',
              collapsed &&
                'justify-center px-0'
            ]"
          >
            <Icon
              :name="item.icon"
              class="text-[20px] shrink-0"
            />

            <template
              v-if="!collapsed"
            >
              <span
                class="flex-1 text-left truncate"
              >
                {{ item.label }}
              </span>

              <Icon
                name="lucide:chevron-down"
                class="transition-transform duration-300"
                :class="
                  open[item.label] &&
                  'rotate-180'
                "
              />
            </template>
          </button>

          <!-- NORMAL SUBMENU -->
          <Transition name="slide">
            <div
              v-show="
                open[item.label] &&
                !collapsed
              "
              class="ml-5 mt-2 border-l border-gray-200 pl-4 space-y-1"
            >
              <NuxtLink
                v-for="child in item.children"
                :key="child.to"
                :to="child.to"
                class="sub-item"
                :class="
                  isActive(
                    child.to
                  ) && 'sub-active'
                "
              >
                {{ child.label }}
              </NuxtLink>
            </div>
          </Transition>

          <!-- FLOATING TOOLTIP MENU -->
          <Transition name="fade">
            <div
              v-if="
                collapsed &&
                hoveredMenu ===
                  item.label
              "
              class="absolute left-[72px] top-0 z-50 w-56 rounded-2xl border border-gray-200 bg-white shadow-2xl p-2"
            >
              <div
                class="px-3 py-2 text-xs font-semibold text-gray-400 uppercase"
              >
                {{ item.label }}
              </div>

              <NuxtLink
                v-for="child in item.children"
                :key="child.to"
                :to="child.to"
                class="tooltip-item"
                :class="
                  isActive(
                    child.to
                  ) && 'sub-active'
                "
              >
                {{ child.label }}
              </NuxtLink>
            </div>
          </Transition>
        </div>
      </template>
    </nav>
  </aside>

  <!-- MOBILE OVERLAY -->
  <Transition name="fade">
    <div
      v-if="mobileOpen"
      @click="mobileOpen = false"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
    />
  </Transition>

  <!-- MOBILE TOGGLE -->
  <button
    @click="mobileOpen = !mobileOpen"
    class="md:hidden fixed bottom-5 right-5 z-[60] h-14 w-14 rounded-full bg-black text-white shadow-xl flex items-center justify-center"
  >
    <Icon
      :name="
        mobileOpen
          ? 'lucide:x'
          : 'lucide:menu'
      "
      class="text-2xl"
    />
  </button>
</template>

<style scoped>
.nav-item {
  @apply relative flex items-center gap-4 h-12 px-4 rounded-2xl
  text-sm text-gray-700 transition-all duration-200;
}

.nav-item:hover {
  @apply bg-sky-50 text-sky-600;
}

.sub-item {
  @apply block px-3 py-2 rounded-xl text-sm text-gray-600 transition-all;
}

.sub-item:hover {
  @apply bg-sky-50 text-sky-600;
}

.tooltip-item {
  @apply flex items-center px-3 py-2 rounded-xl
  text-sm text-gray-700 transition-all;
}

.tooltip-item:hover {
  @apply bg-sky-50 text-sky-600;
}

.active {
  @apply bg-sky-50 text-sky-600 font-medium;
}

.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 4px;
  border-radius: 999px;
  background: rgb(2 132 199);
}

.sub-active {
  @apply bg-sky-50 text-sky-600 font-medium;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>