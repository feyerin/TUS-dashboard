<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { message, Modal } from 'ant-design-vue'

useHead({
  title: 'Discount Product Assignment • Dashboard'
})

const { $api } = useNuxtApp()

const loading = ref(false)
const submitting = ref(false)

const products = ref<any[]>([])
const total = ref(0)

const page = ref(1)
const limit = ref(10)

const search = ref('')

const isModalOpen = ref(false)

const modalLoading = ref(false)
const modalProducts = ref<any[]>([])
const modalTotal = ref(0)

const modalPage = ref(1)
const modalLimit = ref(10)
const modalSearch = ref('')

const selectedProductIds = ref<string[]>([])

const fetchAssignedProducts = async () => {
  loading.value = true

  try {
    const res: any = await $api('/api/v1/public/product', {
      method: 'GET',
      params: {
        page: page.value,
        limit: limit.value,
        tags: 'sales',
        search: search.value || undefined
      }
    })

    products.value = res?.data?.products ?? []
    total.value = res?.pagination?.totalItems ?? 0
  } catch (err: any) {
    message.error(err?.message || 'Failed fetch products')
  } finally {
    loading.value = false
  }
}

const fetchModalProducts = async () => {
  modalLoading.value = true

  try {
    const res: any = await $api('/api/v1/private/product', {
      method: 'GET',
      params: {
        page: modalPage.value,
        limit: modalLimit.value,
        orderBy: '-created_at',
        search: modalSearch.value || undefined
      }
    })

    modalProducts.value = res?.data?.products ?? []
    modalTotal.value = res?.pagination?.totalItems ?? 0
  } catch (err: any) {
    message.error(err?.message || 'Failed fetch products')
  } finally {
    modalLoading.value = false
  }
}

const handleAssign = async () => {
  if (!selectedProductIds.value.length) {
    return message.warning('Please select products')
  }

  submitting.value = true

  try {
    await $api('/api/v1/private/product-tag/bulk-product', {
      method: 'POST',
      body: {
        productIds: selectedProductIds.value,
        tagName: 'sales'
      }
    })

    message.success('Products assigned to Sales')

    isModalOpen.value = false
    selectedProductIds.value = []

    fetchAssignedProducts()
  } catch (err: any) {
    message.error(err?.message || 'Assign failed')
  } finally {
    submitting.value = false
  }
}

const handleRemove = (record: any) => {
  Modal.confirm({
    title: 'Remove Product',
    content: `Remove ${record.name} from Sales?`,
    okType: 'danger',

    async onOk() {
      try {
        await $api(`/api/v1/private/product-tag/delete-product`, {
          method: 'PATCH',
          body: {
            productIds: record.id,
            tagName: 'sales'
        }
        })

        message.success('Removed from Sales')

        fetchAssignedProducts()
      } catch (err: any) {
        message.error(err?.message || 'Remove failed')
      }
    }
  })
}

const handleTableChange = (pagination: any) => {
  page.value = pagination.current
  limit.value = pagination.pageSize

  fetchAssignedProducts()
}

const handleModalTableChange = (pagination: any) => {
  modalPage.value = pagination.current
  modalLimit.value = pagination.pageSize

  fetchModalProducts()
}

watch(search, () => {
  page.value = 1
  fetchAssignedProducts()
})

watch(modalSearch, () => {
  modalPage.value = 1
  fetchModalProducts()
})

const openModal = () => {
  isModalOpen.value = true
  selectedProductIds.value = []

  fetchModalProducts()
}

onMounted(fetchAssignedProducts)
</script>

<template>
  <client-only>
    <div class="space-y-6">
    <div class="bg-transparent pl-6 mt-2">
        <a-breadcrumb>
            <a-breadcrumb-item>
            Dashboard
            </a-breadcrumb-item>

            <a-breadcrumb-item>
            Sale Assignment
            </a-breadcrumb-item>
        </a-breadcrumb>
    </div>
      <div class="bg-white rounded-2xl">
        <a-page-header
          title="Sale Product"
          sub-title="Assign products to Sale"
        >
          <template #extra>
            <a-button
              type="primary"
              @click="openModal"
            >
              Assign Product
            </a-button>
          </template>
        </a-page-header>
      </div>

      <a-card class="rounded-2xl border-0 shadow-sm">
        <div class="flex flex-col gap-5">
          <div class="flex flex-col lg:flex-row gap-3">
            <a-input
              v-model:value="search"
              placeholder="Search product..."
              allow-clear
              class="flex-1"
            >
              <template #prefix>
                <Icon name="lucide:search" />
              </template>
            </a-input>
          </div>

          <div class="flex justify-between items-center text-sm text-gray-500 border-t pt-4">
            <div>
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
          </div>
        </div>

        <a-table
          class="mt-5"
          :data-source="products"
          :loading="loading"
          row-key="id"
          :pagination="{
            current: page,
            pageSize: limit,
            total,
            showSizeChanger: true
          }"
          @change="handleTableChange"
        >
          <a-table-column
            title="Product"
            key="product"
          >
            <template #default="{ record }">
              <div class="flex items-center gap-3">
                <img
                  :src="record.imageUrl"
                  class="w-14 h-14 rounded-lg object-cover border"
                >

                <div class="flex flex-col">
                  <span class="font-medium text-gray-900 line-clamp-1">
                    {{ record.name }}
                  </span>

                  <span class="text-xs text-gray-500">
                    {{ record.brandName }}
                  </span>
                </div>
              </div>
            </template>
          </a-table-column>

          <a-table-column
            title="Price"
            key="price"
          >
            <template #default="{ record }">
              <div class="flex flex-col">
                <span class="text-gray-400 line-through text-sm">
                  Rp
                  {{
                    Number(record.basePrice).toLocaleString()
                  }}
                </span>

                <span class="font-semibold text-red-500">
                  Rp
                  {{
                    Number(record.finalPrice).toLocaleString()
                  }}
                </span>
              </div>
            </template>
          </a-table-column>

          <a-table-column
            title="Discount"
            key="discount"
          >
            <template #default="{ record }">
              <a-tag
                v-if="record.discountType === 'percentage'"
                color="green"
              >
                {{ record.discountValue }}%
              </a-tag>

              <a-tag
                v-else-if="record.discountType === 'fixed'"
                color="blue"
              >
                Rp
                {{
                  Number(record.discountValue).toLocaleString()
                }}
              </a-tag>

              <span v-else>-</span>
            </template>
          </a-table-column>

          <a-table-column
            title="Action"
            key="action"
          >
            <template #default="{ record }">
              <a-button
                danger
                size="small"
                @click="handleRemove(record)"
              >
                Remove
              </a-button>
            </template>
          </a-table-column>
        </a-table>
      </a-card>

      <a-modal
        v-model:open="isModalOpen"
        title="Assign Products"
        width="1000px"
        :confirm-loading="submitting"
        @ok="handleAssign"
      >
        <div class="space-y-4">
          <a-input
            v-model:value="modalSearch"
            placeholder="Search product..."
            allow-clear
          >
            <template #prefix>
              <Icon name="lucide:search" />
            </template>
          </a-input>

          <a-table
            :data-source="modalProducts"
            :loading="modalLoading"
            row-key="id"
            :pagination="{
              current: modalPage,
              pageSize: modalLimit,
              total: modalTotal,
              showSizeChanger: true
            }"
            @change="handleModalTableChange"
            :row-selection="{
              selectedRowKeys: selectedProductIds,
              onChange: (keys:any) => {
                selectedProductIds = keys
              }
            }"
          >
            <a-table-column
              title="Product"
              key="product"
            >
              <template #default="{ record }">
                <div class="flex items-center gap-3">
                  <img
                    :src="record.imageUrl"
                    class="w-14 h-14 rounded-lg object-cover border"
                  >

                  <div class="flex flex-col">
                    <span class="font-medium">
                      {{ record.name }}
                    </span>

                    <span class="text-xs text-gray-500">
                      {{ record.brandName }}
                    </span>
                  </div>
                </div>
              </template>
            </a-table-column>

            <a-table-column
              title="Price"
              key="price"
            >
              <template #default="{ record }">
                Rp
                {{
                  Number(record.finalPrice).toLocaleString()
                }}
              </template>
            </a-table-column>
          </a-table>
        </div>
      </a-modal>
    </div>
  </client-only>
</template>