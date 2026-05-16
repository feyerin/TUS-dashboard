<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { message, Modal } from 'ant-design-vue'

useHead({
  title: 'Product • Dashboard'
})

const config = useRuntimeConfig()

const { formatPrice, formatDate } = useFormatter()
const { getProducts } = useProductApi()

// ================= MASTER DATA =================
const {
  categories,
  brands,
} = useMasterData()

// ================= STATE =================
const products = ref<any[]>([])
const loading = ref(false)
const total = ref(0)

// FILTER
const drawerOpen = ref(false)
const search = ref('')
const category = ref<string>()
const brand = ref<string>()
const status = ref<string>()
const sort = ref('-created_at')

// PAGINATION
const page = ref(1)
const limit = ref(12)

// STATIC OPTIONS
const statuses = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' }
]

// SELECTED FILTER
const selectedCategory = computed(() =>
  categories.value.find(c => c.id === category.value)
)

const selectedBrand = computed(() =>
  brands.value.find(b => b.id === brand.value)
)

// ================= FETCH =================
const fetchProducts = async () => {
  loading.value = true

  try {
    const params: Record<string, any> = {
      page: page.value,
      limit: limit.value,
      orderBy: sort.value
    }

    if (search.value) {
      params.search = search.value
    }

    if (category.value) {
      params.categoryIDs = category.value
    }

    if (brand.value) {
      params.brandIDs = brand.value
    }

    if (status.value) {
      params.status = status.value
    }

    const res = await getProducts(params)

    const data = res?.data

    products.value = Array.isArray(data?.products)
      ? data.products
      : []

    total.value = res?.pagination?.totalItems ?? 0

  } catch (err: any) {
    message.error(err?.message || 'Failed fetch products')
  } finally {
    loading.value = false
  }
}

// ================= AUTO FETCH =================
watch(
  [
    page,
    limit,
    category,
    brand,
    status,
    sort
  ],
  () => {
    fetchProducts()
  }
)

// ================= SEARCH DEBOUNCE =================
let timeout: any

watch(search, () => {
  clearTimeout(timeout)

  timeout = setTimeout(() => {
    page.value = 1
    fetchProducts()
  }, 400)
})

// ================= RESET FILTER =================
const resetFilter = () => {
  search.value = ''
  category.value = undefined
  brand.value = undefined
  status.value = undefined
  sort.value = '-created_at'
  page.value = 1
}

// ================= DELETE =================
const deleteProduct = (record: any) => {
  Modal.confirm({
    title: 'Delete Product',
    content: `Delete ${record.name}?`,
    okType: 'danger',

    async onOk() {
      try {
        await $fetch(
          `${config.public.apiBase}/api/v1/private/product/${record.id}`,
          {
            method: 'DELETE',

            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
          }
        )

        message.success('Product deleted')

        fetchProducts()

      } catch {
        message.error('Delete failed')
      }
    }
  })
}

// ================= INIT =================
onMounted(fetchProducts)
</script>

<template>
  <client-only>
    <div class="space-y-6">

      <!-- HEADER -->
      <div class="shadow-sm bg-white rounded-2xl">
        <a-page-header
          title="Products"
          sub-title="Manage your product inventory and details"
          class="rounded-2xl"
        >
          <template #breadcrumb>
            <a-breadcrumb>
              <a-breadcrumb-item>
                Dashboard
              </a-breadcrumb-item>

              <a-breadcrumb-item>
                Products
              </a-breadcrumb-item>
            </a-breadcrumb>
          </template>

          <template #extra>
            <a-button
              type="primary"
              @click="navigateTo('/products/create')"
              class="flex items-center gap-2"
            >
              <Icon name="lucide:plus" />
              Add Product
            </a-button>
          </template>
        </a-page-header>
      </div>

      <!-- FILTER -->
      <a-card class="rounded-3xl border-0 shadow-sm">

        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <!-- LEFT -->
          <div class="flex items-center gap-3 flex-1">

            <!-- SEARCH -->
            <div class="flex-1 max-w-xl">
              <a-input
                v-model:value="search"
                placeholder="Search products..."
                allow-clear
                class="rounded-md"
              >
                <template #prefix>
                  <Icon
                    name="lucide:search"
                    class="text-gray-400"
                  />
                </template>
              </a-input>
            </div>

            <!-- FILTER BUTTON -->
            <a-button
              class="rounded-md flex items-center gap-2"
              @click="drawerOpen = true"
            >
              <Icon name="lucide:sliders-horizontal" />
              Filters
            </a-button>

          </div>

          <!-- RIGHT -->
          <div class="flex items-center justify-between gap-4">

            <div class="text-sm text-gray-500 whitespace-nowrap">
              Showing
              <span class="font-semibold text-black">
                {{ products.length }}
              </span>
              of
              <span class="font-semibold text-black">
                {{ total }}
              </span>
              products
            </div>

            <a-button
              type="default"
              class="rounded-md"
              @click="resetFilter"
            >
              Clear Filters
            </a-button>

          </div>

        </div>

        <!-- ACTIVE FILTER -->
        <div class="flex flex-wrap items-center gap-2 mt-5">

          <a-tag
            v-if="category"
            closable
            class="rounded-full px-3 py-1"
            @close="category = undefined"
          >
            Category: {{ selectedCategory?.name }}
          </a-tag>

          <a-tag
            v-if="brand"
            closable
            class="rounded-full px-3 py-1"
            @close="brand = undefined"
          >
            Brand: {{ selectedBrand?.name }}
          </a-tag>

          <a-tag
            v-if="status"
            closable
            class="rounded-full px-3 py-1"
            @close="status = undefined"
          >
            Status: {{ status }}
          </a-tag>

        </div>

      </a-card>

      <!-- DRAWER -->
      <a-drawer
        v-model:open="drawerOpen"
        title="Product Filters"
        placement="right"
        width="340"
      >

        <div class="space-y-5">

          <!-- CATEGORY -->
          <div>
            <div class="text-sm font-medium mb-2">
              Category
            </div>

            <a-select
              v-model:value="category"
              placeholder="Select category"
              allow-clear
              class="w-full rounded-md"
            >
              <a-select-option
                v-for="c in categories"
                :key="c.id"
                :value="c.id"
              >
                {{ c.name }}
              </a-select-option>
            </a-select>
          </div>

          <!-- BRAND -->
          <div>
            <div class="text-sm font-medium mb-2">
              Brand
            </div>

            <a-select
              v-model:value="brand"
              placeholder="Select brand"
              allow-clear
              class="w-full rounded-md"
            >
              <a-select-option
                v-for="b in brands"
                :key="b.id"
                :value="b.id"
              >
                {{ b.name }}
              </a-select-option>
            </a-select>
          </div>

          <!-- STATUS -->
          <div>
            <div class="text-sm font-medium mb-2">
              Status
            </div>

            <a-select
              v-model:value="status"
              placeholder="Select status"
              allow-clear
              class="w-full rounded-md"
            >
              <a-select-option
                v-for="s in statuses"
                :key="s.value"
                :value="s.value"
              >
                {{ s.label }}
              </a-select-option>
            </a-select>
          </div>

          <!-- SORT -->
          <div>
            <div class="text-sm font-medium mb-2">
              Sort
            </div>

            <a-select
              v-model:value="sort"
              class="w-full rounded-md"
            >
              <a-select-option value="-created_at">
                Newest
              </a-select-option>

              <a-select-option value="created_at">
                Oldest
              </a-select-option>
            </a-select>
          </div>

          <!-- ACTION -->
          <div class="flex gap-3 pt-4">

            <a-button
              block
              class="rounded-md"
              @click="resetFilter"
            >
              Reset
            </a-button>

            <a-button
              type="primary"
              block
              class="rounded-md"
              @click="drawerOpen = false"
            >
              Apply
            </a-button>

          </div>

        </div>

      </a-drawer>

      <!-- LOADING -->
      <div
        v-if="loading"
        class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5"
      >

        <a-card
          v-for="n in 8"
          :key="n"
          class="rounded-2xl"
        >
          <a-skeleton active />
        </a-card>

      </div>

      <!-- PRODUCT GRID -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5"
      >

        <a-card
          v-for="product in products"
          :key="product.id"
          hoverable
          class="rounded-2xl overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300"
          :body-style="{ padding: '16px' }"
        >

          <!-- IMAGE -->
          <div class="relative group">

            <img
              :src="product.imageUrl"
              class="w-full h-full object-cover rounded-xl transition duration-500 group-hover:scale-[1.03]"
            />

            <!-- STATUS -->
            <div class="absolute top-3 left-3">
              <a-tag
                :color="
                  product.status === 'published'
                    ? 'green'
                    : product.status === 'draft'
                    ? 'orange'
                    : 'default'
                "
              >
                {{ product.status }}
              </a-tag>
            </div>

            <!-- ACTION -->
            <div
              class="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition"
            >

              <button
                class="w-9 h-9 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center shadow hover:scale-105 transition"
              >
                <Icon name="lucide:eye" />
              </button>

              <button
                class="w-9 h-9 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center shadow hover:scale-105 transition"
                @click="navigateTo(`/products/${product.id}`)"
              >
                <Icon name="lucide:pencil" />
              </button>

            </div>

          </div>

          <!-- CONTENT -->
          <div class="mt-4 space-y-4">

            <!-- TITLE -->
            <div>
              <h3 class="font-semibold text-base line-clamp-1">
                {{ product.name }}
              </h3>

              <p class="text-sm text-gray-400 line-clamp-1">
                {{ product.brandName }}
              </p>
            </div>

            <!-- PRICE -->
            <div class="flex items-center justify-between">

              <div>
                <p class="text-xs text-gray-400">
                  Price
                </p>

                <div class="text-lg font-bold">
                  {{ formatPrice(product.basePrice) }}
                </div>
              </div>

              <div class="text-right">
                <p class="text-xs text-gray-400">
                  Created
                </p>

                <div class="text-sm font-medium">
                  {{ formatDate(product.createdAt) }}
                </div>
              </div>

            </div>

            <!-- ACTION -->
            <div class="flex gap-2">

              <a-button
                block
                @click="navigateTo(`/products/${product.id}`)"
              >
                Edit
              </a-button>

              <a-button
                danger
                block
                @click="deleteProduct(product)"
              >
                Delete
              </a-button>

            </div>

          </div>

        </a-card>

      </div>

      <!-- EMPTY -->
      <a-empty
        v-if="!loading && !products.length"
        description="No products found"
      />

      <!-- PAGINATION -->
      <div
        v-if="total > limit"
        class="flex justify-end"
      >

        <a-pagination
          v-model:current="page"
          v-model:pageSize="limit"
          :total="total"
          show-size-changer
        />

      </div>

    </div>
  </client-only>
</template>