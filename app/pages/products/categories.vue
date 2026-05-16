<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { message, Modal } from 'ant-design-vue'

useHead({
  title: 'Categories • Dashboard'
})

const { getCategories, createCategory, updateCategory, deleteCategory } = useCategory()
const { collections } = useMasterData()

// ================= STATE =================
const categories = ref<any[]>([])
const loading = ref(false)
const total = ref(0)

const search = ref('')
const deleted = ref<string | undefined>()
const sort = ref('-created_at')

const page = ref(1)
const limit = ref(10)

const isModalOpen = ref(false)
const submitting = ref(false)
const isEditMode = ref(false)
const selectedId = ref<string | null>(null)

const formState = ref({
  name: '',
  collectionId: undefined as string | undefined
})

let isFetching = false
let searchTimeout: any

// ================= COMPUTED =================
const collectionOptions = computed(() => {
  return collections.value.map((item: any) => ({
    label: item.name,
    value: item.id
  }))
})

const collectionMap = computed(() => {
  return collections.value.reduce(
    (acc: Record<string, string>, item: any) => {
      acc[item.id] = item.name
      return acc
    },
    {}
  )
})

// ================= FETCH =================
const fetchCategories = async () => {
  if (isFetching) return

  isFetching = true
  loading.value = true

  try {
    const res: any = await getCategories({
      page: page.value,
      limit: limit.value,
      name: search.value || undefined,
      orderBy: sort.value
    })

    categories.value = res?.categories ?? []
    total.value = res?.pagination?.totalItems ?? 0
  } catch (err: any) {
    message.error(err?.message || 'Failed fetch categories')
  } finally {
    loading.value = false
    isFetching = false
  }
}

// ================= WATCH =================
watch(search, () => {
  clearTimeout(searchTimeout)

  searchTimeout = setTimeout(() => {
    page.value = 1
    fetchCategories()
  }, 400)
})

watch(sort, () => {
  page.value = 1
  fetchCategories()
})

// ================= FILTER =================
const applyFilter = () => {
  page.value = 1
  fetchCategories()
}

const resetFilter = () => {
  search.value = ''
  deleted.value = undefined
  page.value = 1
  fetchCategories()
}

// ================= TABLE =================
const handleTableChange = (pagination: any) => {
  page.value = pagination.current
  limit.value = pagination.pageSize
  fetchCategories()
}

// ================= MODAL =================
const openCreateModal = () => {
  isEditMode.value = false
  selectedId.value = null

  formState.value = {
    name: '',
    collectionId: undefined
  }

  isModalOpen.value = true
}

const openEditModal = (record: any) => {
  isEditMode.value = true
  selectedId.value = record.id

  formState.value = {
    name: record.name,
    collectionId: record.collectionId
  }

  isModalOpen.value = true
}

const resetModal = () => {
  isModalOpen.value = false
  isEditMode.value = false
  selectedId.value = null

  formState.value = {
    name: '',
    collectionId: undefined
  }
}

// ================= SUBMIT =================
const handleSubmit = async () => {
  if (!formState.value.name) {
    message.warning('Category name is required')
    return
  }

  if (!formState.value.collectionId) {
    message.warning('Collection is required')
    return
  }

  submitting.value = true

  try {
    const payload = {
      name: formState.value.name,
      collectionId: formState.value.collectionId
    }

    if (isEditMode.value && selectedId.value) {
      await updateCategory(selectedId.value, payload)
      message.success('Category updated')
    } else {
      await createCategory(payload)
      message.success('Category created')
    }

    resetModal()
    fetchCategories()
  } catch (err: any) {
    message.error(err?.message || 'Submit failed')
  } finally {
    submitting.value = false
  }
}

// ================= DELETE =================
const handleDelete = (record: any) => {
  Modal.confirm({
    title: 'Delete Category',
    content: `Delete ${record.name}?`,
    okType: 'danger',

    async onOk() {
      try {
        await deleteCategory(record.id)
        message.success('Category deleted')
        fetchCategories()
      } catch (err: any) {
        message.error(err?.message || 'Delete failed')
      }
    }
  })
}

// ================= INIT =================
onMounted(async () => {
  fetchCategories()
})
</script>

<template>
  <client-only>
    <div class="space-y-6">
      <div class="bg-white rounded-2xl">
        <a-page-header title="Categories" sub-title="Manage product categories" class="rounded-2xl">
          <template #breadcrumb>
            <a-breadcrumb>
              <a-breadcrumb-item>Dashboard</a-breadcrumb-item>
              <a-breadcrumb-item>Categories</a-breadcrumb-item>
            </a-breadcrumb>
          </template>

          <template #extra>
            <a-button type="primary" class="flex items-center gap-2" @click="openCreateModal">
              <Icon name="lucide:plus" />
              Add Category
            </a-button>
          </template>
        </a-page-header>
      </div>

      <a-card class="rounded-2xl border-0 shadow-sm">
        <div class="flex flex-col gap-5">
          <div class="flex flex-col lg:flex-row gap-3 lg:items-center">
            <a-input v-model:value="search" placeholder="Search categories..." allow-clear class="flex-1">
              <template #prefix>
                <Icon name="lucide:search" />
              </template>
            </a-input>

            <a-select v-model:value="deleted" placeholder="Status" allow-clear class="w-full lg:w-44">
              <a-select-option value="false">Active</a-select-option>
              <a-select-option value="true">Deleted</a-select-option>
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
                {{ categories.length }}
              </span>
              of
              <span class="font-semibold text-black">
                {{ total }}
              </span>
              categories
            </div>
          </div>
        </div>

        <a-table
          class="mt-5"
          :columns="[
            { title: 'Name', key: 'name' },
            { title: 'Collection', key: 'collection' },
            { title: 'Slug', key: 'slug' },
            { title: 'Created', key: 'createdAt' },
            { title: 'Action', key: 'action' }
          ]"
          :data-source="categories"
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
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
              <span class="font-medium text-gray-900">
                {{ record.name }}
              </span>
            </template>

            <template v-else-if="column.key === 'collection'">
              <span class="text-gray-500 text-sm">
                {{
                  collectionMap[
                    record.collectionId
                  ] || '-'
                }}
              </span>
            </template>

            <template v-else-if="column.key === 'slug'">
              <span class="text-gray-500 text-sm">
                {{ record.slug }}
              </span>
            </template>

            <template v-else-if="column.key === 'createdAt'">
              <span class="text-sm text-gray-500">
                {{ new Date(record.createdAt).toLocaleString() }}
              </span>
            </template>

            <template v-else-if="column.key === 'action'">
              <div class="flex gap-2">
                <a-button size="small" @click="openEditModal(record)">
                  Edit
                </a-button>

                <a-button danger size="small" @click="handleDelete(record)">
                  Delete
                </a-button>
              </div>
            </template>
          </template>
        </a-table>
      </a-card>

      <a-modal
        v-model:open="isModalOpen"
        :title="isEditMode ? 'Edit Category' : 'Add Category'"
        :confirm-loading="submitting"
        @ok="handleSubmit"
        @cancel="resetModal"
      >
        <div class="pt-2">
          <a-form layout="vertical">
            <a-form-item label="Category Name" required>
              <a-input
                v-model:value="formState.name"
                placeholder="Enter category name"
                size="large"
              />
            </a-form-item>

            <a-form-item label="Collection" required>
              <a-select
                v-model:value="formState.collectionId"
                :options="collectionOptions"
                placeholder="Select collection"
                size="large"
              />
            </a-form-item>
          </a-form>
        </div>
      </a-modal>
    </div>
  </client-only>
</template>