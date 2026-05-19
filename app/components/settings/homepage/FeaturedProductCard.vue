<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'

import ProductPickerModal from './ProductPickerModal.vue'

interface Product {
  id: string
  name: string
  imageUrl: string
  basePrice: number
  description?: string
  slug?: string
  status?: string
}

type SectionResponse = {
  data?: {
    content?: Product[]
  }
}

const {
  updateSection,
  getSection,
  DYNAMIC_SECTION_KEY
} = useDynamicSection()

const { getProducts } = useProductApi()

const loading = ref(false)
const productLoading = ref(false)
const open = ref(false)

const products = ref<Product[]>([])
const selected = ref<Product[]>([])

const columns = [
  {
    title: 'Image',
    dataIndex: 'imageUrl'
  },
  {
    title: 'Product',
    dataIndex: 'name'
  },
  {
    title: 'Price',
    dataIndex: 'basePrice'
  },
  {
    title: 'Status',
    dataIndex: 'status'
  },
  {
    title: 'Action',
    dataIndex: 'action'
  }
]

const fetchProducts = async () => {
  try {
    productLoading.value = true

    const res = await getProducts()

    products.value =
      res.data?.products || []
  } catch (error) {
    console.error(error)
    message.error('Gagal mengambil product')
  } finally {
    productLoading.value = false
  }
}

const fetchSection = async () => {
  try {
    const res = (await getSection(
      DYNAMIC_SECTION_KEY.FEATURED_PRODUCTS
    )) as SectionResponse

    selected.value =
      res.data?.content || []
  } catch (error) {
    console.error(error)
    message.error('Gagal mengambil featured product')
  }
}

const handleDelete = (id: string) => {
  Modal.confirm({
    title: 'Delete Product',
    content:
      'Remove this product from featured section?',
    okType: 'danger',

    onOk() {
      selected.value =
        selected.value.filter(
          item => item.id !== id
        )

      message.success('Product removed')
    }
  })
}

const handleSave = async () => {
  try {
    loading.value = true

    const res = (await updateSection(
      DYNAMIC_SECTION_KEY.FEATURED_PRODUCTS,
      {
        content: selected.value
      }
    )) as {
      success: boolean
    }

    message.success(
      'Featured product berhasil disimpan'
    )

  } catch (error) {
    console.error(error)
    message.error(
      'Gagal menyimpan featured product'
    )
   } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
  fetchSection()
})
</script>

<template>
  <a-card
    title="Featured Product"
    :bordered="false"
    class="shadow-sm rounded-xl"
  >
    <div class="space-y-5">
      <div class="flex justify-end">
        <a-button @click="open = true">
          Pilih Product
        </a-button>
      </div>

      <a-table
        :data-source="selected"
        :columns="columns"
        row-key="id"
        :pagination="false"
        :loading="productLoading"
      >
        <template #bodyCell="{ column, record }">
          <template
            v-if="
              column.dataIndex === 'imageUrl'
            "
          >
            <img
              :src="
                (record as Product).imageUrl
              "
              class="w-14 h-14 object-cover rounded-lg border"
            >
          </template>

          <template
            v-else-if="
              column.dataIndex === 'name'
            "
          >
            <div class="flex flex-col">
              <span class="font-medium">
                {{
                  (record as Product).name
                }}
              </span>

              <span
                class="text-xs text-gray-500"
              >
                {{
                  (record as Product).slug
                }}
              </span>
            </div>
          </template>

          <template
            v-else-if="
              column.dataIndex === 'basePrice'
            "
          >
            <span class="font-medium">
              Rp
              {{
                Number(
                  (
                    record as Product
                  ).basePrice
                ).toLocaleString('id-ID')
              }}
            </span>
          </template>

          <template
            v-else-if="
              column.dataIndex === 'status'
            "
          >
            <a-tag
              :color="
                (
                  record as Product
                ).status === 'published'
                  ? 'green'
                  : 'orange'
              "
            >
              {{
                (
                  record as Product
                ).status
              }}
            </a-tag>
          </template>

          <template
            v-else-if="
              column.dataIndex === 'action'
            "
          >
            <a-button
              danger
              size="small"
              @click="
                handleDelete(
                  (
                    record as Product
                  ).id
                )
              "
            >
              Delete
            </a-button>
          </template>
        </template>
      </a-table>

      <div class="flex justify-end">
        <a-button
          type="primary"
          :loading="loading"
          @click="handleSave"
        >
          Save Settings
        </a-button>
      </div>
    </div>

    <ProductPickerModal
      v-model:open="open"
      :products="products"
      :selected="selected"
      @change="selected = $event"
    />
  </a-card>
</template>