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

      <!-- HERO -->
      <div class="relative overflow-hidden rounded-3xl bg-[#0f172a] p-8 text-white">

        <!-- BG -->
        <div class="absolute inset-0 opacity-30">
          <div class="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-sky-500 blur-3xl" />
          <div class="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-violet-500 blur-3xl" />
        </div>

        <div class="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          <!-- LEFT -->
          <div class="max-w-2xl">

            <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm backdrop-blur-xl">
              <Icon name="lucide:sparkles" />
              Product Dashboard
            </div>

            <h1 class="mt-6 text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Manage your products smarter & faster.
            </h1>

            <p class="mt-5 text-slate-300 text-lg leading-relaxed">
              manage categories, brands, pricing, and monitor product activity in one place.
            </p>

            <div class="mt-8 flex flex-wrap gap-3">

              <a-button
                type="primary"
                size="large"
                class="!rounded-2xl !h-12 !px-6"
                @click="navigateTo('/products/create')"
              >
                Add Product
              </a-button>

            </div>

          </div>

          <!-- RIGHT -->
          <div class="grid grid-cols-2 gap-4 w-full max-w-md">

            <div class="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-5">
              <div class="flex items-center justify-between">
                <span class="text-slate-300 text-sm">
                  Products
                </span>

                <div class="h-10 w-10 rounded-2xl bg-sky-500/20 flex items-center justify-center">
                  <Icon name="lucide:box" class="text-sky-300" />
                </div>
              </div>

              <div class="mt-6 text-3xl font-black">
                {{ total }}
              </div>
            </div>

            <div class="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-5">
              <div class="flex items-center justify-between">
                <span class="text-slate-300 text-sm">
                  Categories
                </span>

                <div class="h-10 w-10 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                  <Icon name="lucide:layout-grid" class="text-violet-300" />
                </div>
              </div>

              <div class="mt-6 text-3xl font-black">
                {{ categories.length }}
              </div>
            </div>

            <div class="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-5">
              <div class="flex items-center justify-between">
                <span class="text-slate-300 text-sm">
                  Brands
                </span>

                <div class="h-10 w-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                  <Icon name="lucide:badge-check" class="text-emerald-300" />
                </div>
              </div>

              <div class="mt-6 text-3xl font-black">
                {{ brands.length }}
              </div>
            </div>

            <div class="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-5">
              <div class="flex items-center justify-between">
                <span class="text-slate-300 text-sm">
                  Published
                </span>

                <div class="h-10 w-10 rounded-2xl bg-orange-500/20 flex items-center justify-center">
                  <Icon name="lucide:rocket" class="text-orange-300" />
                </div>
              </div>

              <div class="mt-6 text-3xl font-black">
                {{
                  products.filter(
                    p => p.status === 'published'
                  ).length
                }}
              </div>
            </div>

          </div>

        </div>

      </div>

      <!-- TOP BAR -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <!-- SEARCH -->
        <div class="flex items-center gap-3 w-full lg:max-w-xl">

          <a-input
            v-model:value="search"
            size="large"
            placeholder="Search products..."
            allow-clear
            class="!rounded-2xl"
          >
            <template #prefix>
              <Icon
                name="lucide:search"
                class="text-gray-400"
              />
            </template>
          </a-input>

          <a-button
            size="large"
            class="!rounded-2xl"
            @click="drawerOpen = true"
          >
            <template #icon>
              <Icon name="lucide:sliders-horizontal" />
            </template>
          </a-button>

        </div>

        <!-- FILTER -->
        <div class="flex items-center gap-3">

          <a-select
            v-model:value="sort"
            size="large"
            class="min-w-[180px]"
          >
            <a-select-option value="-created_at">
              Newest
            </a-select-option>

            <a-select-option value="created_at">
              Oldest
            </a-select-option>
          </a-select>

          <a-button
            size="large"
            class="!rounded-2xl"
            @click="resetFilter"
          >
            Reset
          </a-button>

        </div>

      </div>

      <!-- PRODUCT GRID -->
      <div
        v-if="!loading"
        class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5"
      >

        <a-card
          v-for="product in products"
          :key="product.id"
          hoverable
          class="group rounded-3xl overflow-hidden border-0 shadow-sm hover:shadow-2xl transition-all duration-300"
          :body-style="{ padding: '16px' }"
        >

          <!-- IMAGE -->
          <div class="relative overflow-hidden rounded-2xl">

            <img
              :src="product.imageUrl"
              class="w-full h-full object-cover transition duration-700 group-hover:scale-105"
            />

            <!-- OVERLAY -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition" />

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
            <div class="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">

              <button
                class="h-10 w-10 rounded-2xl bg-white/90 backdrop-blur flex items-center justify-center shadow-lg hover:scale-105 transition"
              >
                <Icon name="lucide:eye" />
              </button>

              <button
                class="h-10 w-10 rounded-2xl bg-white/90 backdrop-blur flex items-center justify-center shadow-lg hover:scale-105 transition"
                @click="navigateTo(`/products/${product.id}`)"
              >
                <Icon name="lucide:pencil" />
              </button>

            </div>

          </div>

          <!-- CONTENT -->
          <div class="mt-5">

            <div class="flex items-start justify-between gap-3">

              <div>
                <h3 class="font-bold text-base line-clamp-1">
                  {{ product.name }}
                </h3>

                <p class="text-sm text-gray-400 mt-1">
                  {{ product.brandName }}
                </p>
              </div>

              <div class="text-right">
                <div class="text-lg font-black">
                  {{ formatPrice(product.basePrice) }}
                </div>
              </div>

            </div>

            <div class="mt-5 flex items-center justify-between text-sm">

              <div>
                <div class="text-gray-400">
                  Created
                </div>

                <div class="font-medium">
                  {{ formatDate(product.createdAt) }}
                </div>
              </div>

              <div class="flex items-center gap-2">

                <button
                  class="h-10 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 transition font-medium"
                  @click="navigateTo(`/products/${product.id}`)"
                >
                  Edit
                </button>

                <button
                  class="h-10 px-4 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 transition font-medium"
                  @click="deleteProduct(product)"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        </a-card>

      </div>

      <!-- LOADING -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5"
      >
        <a-card
          v-for="n in 8"
          :key="n"
          class="rounded-3xl"
        >
          <a-skeleton active />
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

    <!-- DRAWER -->
    <a-drawer
      v-model:open="drawerOpen"
      title="Filters"
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
            size="large"
            class="w-full"
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
            size="large"
            class="w-full"
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
            size="large"
            class="w-full"
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

        <!-- ACTION -->
        <div class="flex gap-3 pt-4">

          <a-button
            block
            size="large"
            class="!rounded-2xl"
            @click="resetFilter"
          >
            Reset
          </a-button>

          <a-button
            type="primary"
            block
            size="large"
            class="!rounded-2xl"
            @click="drawerOpen = false"
          >
            Apply
          </a-button>

        </div>

      </div>
    </a-drawer>
  </client-only>
</template>