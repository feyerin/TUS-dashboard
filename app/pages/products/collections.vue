<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import type { CollectionResponse } from '~/type/collection'

useHead({
  title: 'Collections • Dashboard'
})

const {
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection
} = useCollection()

const collections = ref<any[]>([])
const loading = ref(false)
const total = ref(0)

const search = ref('')
const deleted = ref<string | undefined>()

const page = ref(1)
const limit = ref(10)

const isModalOpen = ref(false)
const submitting = ref(false)
const isEditMode = ref(false)
const selectedId = ref<string | null>(null)

const formState = ref({
  name: '',
  slug: ''
})

let isFetching = false

// ================= FETCH =================
const fetchCollections = async () => {
  if (isFetching) return

  isFetching = true
  loading.value = true

  try {
    const res =
      await getCollections({
        page: page.value,
        limit: limit.value,
        name: search.value || undefined,
        deleted: deleted.value === 'true'
      }) as CollectionResponse

    console.log(res.data)

    collections.value =
      res.data.collections ?? []

    total.value =
      res.pagination.totalItems ?? 0

  } catch (err: any) {
    message.error(
      err?.message ||
        'Failed fetch collections'
    )
  } finally {
    loading.value = false
    isFetching = false
  }
}

// ================= FILTER =================
const applyFilter = () => {
  page.value = 1
  fetchCollections()
}

const resetFilter = () => {
  search.value = ''
  deleted.value = undefined
  page.value = 1
  fetchCollections()
}

// ================= TABLE =================
const handleTableChange = (pagination: any) => {
  page.value = pagination.current
  limit.value = pagination.pageSize
  fetchCollections()
}

// ================= MODAL =================
const openCreateModal = () => {
  isEditMode.value = false
  selectedId.value = null
  formState.value = { name: '', slug: '' }
  isModalOpen.value = true
}

const openEditModal = (record: any) => {
  isEditMode.value = true
  selectedId.value = record.id
  formState.value = {
    name: record.name,
    slug: record.slug
  }
  isModalOpen.value = true
}

const resetModal = () => {
  isModalOpen.value = false
  isEditMode.value = false
  selectedId.value = null
  formState.value = { name: '', slug: '' }
}

const handleSubmit = async () => {
  if (!formState.value.name) {
    message.warning('Name is required')
    return
  }

  submitting.value = true

  try {
    const payload = {
      name: formState.value.name,
      slug: formState.value.slug
    }

    if (isEditMode.value && selectedId.value) {
      await updateCollection(selectedId.value, payload)
      message.success('Collection updated')
    } else {
      await createCollection(payload)
      message.success('Collection created')
    }

    resetModal()
    fetchCollections()

  } catch (err: any) {
    message.error(err?.message || 'Submit failed')
  } finally {
    submitting.value = false
  }
}

// ================= DELETE =================
const handleDelete = (record: any) => {
  Modal.confirm({
    title: 'Delete Collection',
    content: `Delete ${record.name}?`,
    okType: 'danger',
    async onOk() {
      try {
        await deleteCollection(record.id)
        message.success('Deleted')
        fetchCollections()
      } catch {
        message.error('Delete failed')
      }
    }
  })
}

// ================= INIT =================
onMounted(fetchCollections)
</script>

<template>
  <client-only>
    <div class="space-y-6">

      <!-- HEADER -->
      <div class="bg-white rounded-xl">
        <a-page-header
          title="Collections"
          sub-title="Manage product collections"
          class="rounded-xl"
        >
          <template #breadcrumb>
            <a-breadcrumb>
              <a-breadcrumb-item>Dashboard</a-breadcrumb-item>
              <a-breadcrumb-item>Collections</a-breadcrumb-item>
            </a-breadcrumb>
          </template>

          <template #extra>
            <a-button
              type="primary"
              @click="openCreateModal"
              class="flex items-center gap-2"
            >
              <Icon name="i-heroicons-plus-circle-20-solid" />
              Add Collection
            </a-button>
          </template>
        </a-page-header>
      </div>

      <!-- TABLE CARD -->
      <a-card class="rounded-2xl border-0 shadow-sm">

        <div class="flex flex-col gap-5">

          <!-- FILTER BAR -->
          <div
            class="flex flex-col lg:flex-row gap-3 lg:items-center"
          >

            <!-- SEARCH -->
            <a-input
              v-model:value="search"
              placeholder="Search collections..."
              allow-clear
              class="flex-1"
            >
              <template #prefix>
                <Icon name="lucide:search" />
              </template>
            </a-input>

            <!-- STATUS FILTER -->
            <a-select
              v-model:value="deleted"
              placeholder="Status"
              allow-clear
              class="w-full lg:w-44"
            >
              <a-select-option value="false">
                Active
              </a-select-option>

              <a-select-option value="true">
                Deleted
              </a-select-option>
            </a-select>

            <!-- ACTION -->
            <a-button
              class="flex-1 md:flex-none"
              @click="resetFilter"
            >
              Reset
            </a-button>

            <a-button
              type="primary"
              class="flex-1 md:flex-none"
              @click="applyFilter"
            >
              Apply
            </a-button>

          </div>

          <!-- INFO ROW -->
          <div
            class="flex justify-between items-center text-sm text-gray-500 border-t pt-4"
          >

            <div>
              Showing
              <span class="font-semibold text-black">
                {{ collections.length }}
              </span>
              of
              <span class="font-semibold text-black">
                {{ total }}
              </span>
              collections
            </div>

          </div>

        </div>

        <!-- TABLE -->
        <a-table
          class="mt-5"
          :data-source="collections"
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

          <!-- NAME -->
          <a-table-column
            title="Name"
            data-index="name"
            key="name"
          >
            <template #default="{ record }">
              <span
                class="font-medium text-gray-900"
              >
                {{ record.name }}
              </span>
            </template>
          </a-table-column>

          <!-- SLUG -->
          <a-table-column
            title="Slug"
            data-index="slug"
            key="slug"
          >
            <template #default="{ record }">
              <span
                class="text-gray-500 text-sm"
              >
                {{ record.slug }}
              </span>
            </template>
          </a-table-column>

          <!-- STATUS -->
          <a-table-column
            title="Status"
            key="deleted"
          >
            <template #default="{ record }">

              <a-tag
                :color="
                  record.deleted
                    ? 'red'
                    : 'green'
                "
              >
                {{
                  record.deleted
                    ? 'Deleted'
                    : 'Active'
                }}
              </a-tag>

            </template>
          </a-table-column>

          <!-- ACTION -->
          <a-table-column
            title="Action"
            key="action"
          >
            <template #default="{ record }">

              <div class="flex gap-2">

                <a-button
                  size="small"
                  @click="
                    openEditModal(record)
                  "
                >
                  Edit
                </a-button>

                <a-button
                  danger
                  size="small"
                  @click="
                    handleDelete(record)
                  "
                >
                  Delete
                </a-button>

              </div>

            </template>
          </a-table-column>

        </a-table>

      </a-card>

      <!-- MODAL -->
      <a-modal
        v-model:open="isModalOpen"
        :title="isEditMode ? 'Edit Collection' : 'Add Collection'"
        :confirm-loading="submitting"
        @ok="handleSubmit"
        @cancel="resetModal"
      >
        <a-form layout="vertical" class="space-y-3">

          <a-form-item label="Name" required>
            <a-input v-model:value="formState.name" />
          </a-form-item>

          <a-form-item label="Slug">
            <a-input v-model:value="formState.slug" />
          </a-form-item>

        </a-form>
      </a-modal>

    </div>
  </client-only>
</template>