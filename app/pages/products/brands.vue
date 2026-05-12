<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import type { TablePaginationConfig, UploadProps } from 'ant-design-vue'
import type { BrandItem } from '~/type/brand'

const { uploadImage } = useUpload()
const { getBrands, createBrand, updateBrand, deleteBrand } = useBrand()
const { formatDate } = useFormatter()

const brands = ref<BrandItem[]>([])
const loading = ref(false)
const total = ref(0)

const search = ref('')
const deleted = ref('false')

const page = ref(1)
const limit = ref(10)

const open = ref(false)
const creating = ref(false)

const isEdit = ref(false)
const selectedId = ref<string | null>(null)

const form = reactive({
  name: '',
  profileImageUrl: ''
})

const previewFileUrl = ref('')
const imageLoading = ref(false)

const fetchBrands = async () => {
  loading.value = true

  try {
    const res = await getBrands({
      page: page.value,
      limit: limit.value,
      search: search.value || undefined,
      deleted: deleted.value === 'true'
    })

    brands.value = res.data.brands ?? []
    total.value = res.pagination.totalItems ?? 0
  } catch (err: any) {
    message.error(err?.message || 'Failed fetch brands')
  } finally {
    loading.value = false
  }
}

const applyFilter = () => {
  page.value = 1
  fetchBrands()
}

const resetFilter = () => {
  search.value = ''
  deleted.value = 'false'
  page.value = 1
  fetchBrands()
}

const handleTableChange = (pagination: TablePaginationConfig) => {
  page.value = pagination.current || 1
  limit.value = pagination.pageSize || 10
  fetchBrands()
}

const openCreateModal = () => {
  isEdit.value = false
  selectedId.value = null
  resetForm()
  open.value = true
}

const openEditModal = (record: BrandItem) => {
  isEdit.value = true
  selectedId.value = record.id

  form.name = record.name
  form.profileImageUrl = record.profileImageUrl || ''

  previewFileUrl.value = record.profileImageUrl || ''

  open.value = true
}

const submit = async () => {
  if (!form.name) {
    return message.warning('Brand name required')
  }

  if (!form.profileImageUrl) {
    return message.warning('Brand image required')
  }

  creating.value = true

  try {
    const payload = {
      name: form.name,
      profileImageUrl: form.profileImageUrl
    }

    if (isEdit.value && selectedId.value) {
      await updateBrand(selectedId.value, payload)
      message.success('Brand updated')
    } else {
      await createBrand(payload)
      message.success('Brand created')
    }

    open.value = false
    resetForm()
    fetchBrands()
  } catch (err: any) {
    message.error(err?.message || (isEdit.value ? 'Update failed' : 'Create failed'))
  } finally {
    creating.value = false
  }
}

const handleUpload: UploadProps['beforeUpload'] = async file => {
  imageLoading.value = true

  try {
    const reader = new FileReader()

    reader.onload = (e: ProgressEvent<FileReader>) => {
      previewFileUrl.value = e.target?.result as string
    }

    reader.readAsDataURL(file)

    const res: any = await uploadImage(file)

    form.profileImageUrl = res?.data?.url || res

    message.success('Upload success')
  } catch {
    message.error('Upload failed')
  } finally {
    imageLoading.value = false
  }

  return false
}

const handleDelete = (record: BrandItem) => {
  Modal.confirm({
    title: 'Delete Brand',
    content: `Delete ${record.name}?`,
    okType: 'danger',

    async onOk() {
      try {
        await deleteBrand(record.id)

        message.success('Deleted')

        fetchBrands()
      } catch {
        message.error('Delete failed')
      }
    }
  })
}

const resetForm = () => {
  form.name = ''
  form.profileImageUrl = ''
  previewFileUrl.value = ''
}

onMounted(fetchBrands)
</script>

<template>
  <client-only>
    <div class="space-y-6">
      <div class="bg-white rounded-2xl">
        <a-page-header title="Brands" sub-title="Manage your brand list">
          <template #breadcrumb>
            <a-breadcrumb>
              <a-breadcrumb-item>Dashboard</a-breadcrumb-item>
              <a-breadcrumb-item>Brands</a-breadcrumb-item>
            </a-breadcrumb>
          </template>

          <template #extra>
            <a-button type="primary" @click="openCreateModal" class="flex items-center gap-2">
              <Icon name="lucide:plus" />
              Add Brand
            </a-button>
          </template>
        </a-page-header>
      </div>

      <a-card class="rounded-2xl border-0 shadow-sm">
        <div class="flex flex-col gap-5">
          <div class="flex flex-col lg:flex-row gap-3 lg:items-center">
            <a-input v-model:value="search" placeholder="Search brands..." allow-clear class="flex-1">
              <template #prefix>
                <Icon name="lucide:search" />
              </template>
            </a-input>

            <a-select v-model:value="deleted" placeholder="Status" allow-clear class="w-full lg:w-44">
              <a-select-option value="false">
                Active
              </a-select-option>

              <a-select-option value="true">
                Deleted
              </a-select-option>
            </a-select>

            <a-button class="flex-1 md:flex-none" @click="resetFilter">
              Reset
            </a-button>

            <a-button type="primary" class="flex-1 md:flex-none" @click="applyFilter">
              Apply
            </a-button>
          </div>

          <div class="flex justify-between items-center text-sm text-gray-500 border-t pt-4">
            <div>
              Showing
              <span class="font-semibold text-black">
                {{ brands.length }}
              </span>
              of
              <span class="font-semibold text-black">
                {{ total }}
              </span>
              brands
            </div>
          </div>
        </div>

        <a-table
          class="mt-5"
          :data-source="brands"
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
          <a-table-column title="Image" key="image">
            <template #default="{ record }">
              <img :src="record.profileImageUrl" class="w-12 h-12 rounded-xl object-cover" />
            </template>
          </a-table-column>

          <a-table-column title="Brand Name" data-index="name" key="name" />

          <a-table-column title="Slug" data-index="slug" key="slug" />

          <a-table-column title="Created At" key="createdAt">
            <template #default="{ record }">
              {{ formatDate(record.createdAt) }}
            </template>
          </a-table-column>

          <a-table-column title="Action" key="action">
            <template #default="{ record }">
              <div class="flex gap-2">
                <a-button size="small" @click="openEditModal(record)">
                  Edit
                </a-button>

                <a-button danger size="small" @click="handleDelete(record)">
                  Delete
                </a-button>
              </div>
            </template>
          </a-table-column>
        </a-table>
      </a-card>

      <a-modal
        v-model:open="open"
        :title="isEdit ? 'Edit Brand' : 'Create Brand'"
        :confirm-loading="creating"
        @ok="submit"
        :ok-text="isEdit ? 'Update' : 'Create'"
      >
        <div class="space-y-6 pt-2">
          <div>
            <label class="text-sm font-medium text-gray-600">
              Brand Name
            </label>

            <a-input
              v-model:value="form.name"
              placeholder="Nike, Adidas..."
              size="large"
              class="mt-2"
            />
          </div>

          <div>
            <a-upload
              :before-upload="handleUpload"
              :show-upload-list="false"
              accept="image/*"
              class="mt-2"
            >
              <div class="border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer hover:border-blue-400 transition">
                <img
                  v-if="previewFileUrl"
                  :src="previewFileUrl"
                  class="w-full h-48 object-cover rounded-xl"
                />

                <img
                  v-else-if="form.profileImageUrl"
                  :src="form.profileImageUrl"
                  class="w-full h-48 object-cover rounded-xl"
                />

                <div v-else class="py-10 text-gray-400">
                  Click or drop image here
                </div>
              </div>
            </a-upload>

            <div v-if="imageLoading" class="text-blue-500 text-sm mt-2">
              Uploading image...
            </div>
          </div>
        </div>
      </a-modal>
    </div>
  </client-only>
</template>