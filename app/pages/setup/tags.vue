<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { message, Modal } from 'ant-design-vue'

import { useTag } from '~/composables/useTag'
import type { Tag, TagPayload, TagResponse } from '~/type/tag'

const { getTags, createTag, updateTag, deleteTag } = useTag()

// ================= STATE =================
const tags = ref<Tag[]>([])
const loading = ref(false)
const total = ref(0)

const isModalOpen = ref(false)
const submitting = ref(false)

const isEditMode = ref(false)
const selectedId = ref<string | null>(null)

const formState = ref<TagPayload>({
  name: ''
})

// ================= FILTER =================
const search = ref('')
const sort = ref('-created_at')

// ================= PAGINATION =================
const page = ref(1)
const limit = ref(10)

// ================= FETCH =================
const fetchTags = async () => {
  loading.value = true

  try {
    const res: TagResponse =
      await getTags({
        page: page.value,
        limit: limit.value,
        orderBy: sort.value,
        search:
          search.value || undefined
      })

    tags.value =
      res.data.tags ?? []

    total.value =
      res.pagination.totalItems ?? 0

  } catch (err: any) {

    message.error(
      err?.message ||
      'Failed fetch tags'
    )

  } finally {
    loading.value = false
  }
}

// ================= ACTION =================
const applyFilter = () => {
  page.value = 1
  fetchTags()
}

const resetFilter = () => {
  search.value = ''
  page.value = 1

  fetchTags()
}

const handleTableChange = (
  pagination: any
) => {
  page.value = pagination.current
  limit.value = pagination.pageSize

  fetchTags()
}

const resetModal = () => {
  isModalOpen.value = false
  isEditMode.value = false
  selectedId.value = null

  formState.value = {
    name: ''
  }
}

const openCreateModal = () => {
  resetModal()
  isModalOpen.value = true
}

const openEditModal = (
  record: Tag
) => {
  isEditMode.value = true
  selectedId.value = record.id

  formState.value = {
    name: record.name
  }

  isModalOpen.value = true
}

const handleSubmitTag = async () => {
  if (!formState.value.name) {
    message.warning(
      'Tag name is required'
    )

    return
  }

  submitting.value = true

  try {

    // UPDATE
    if (
      isEditMode.value &&
      selectedId.value
    ) {

      await updateTag(
        selectedId.value,
        formState.value
      )

      message.success(
        'Tag updated'
      )

    } else {

      // CREATE
      await createTag(
        formState.value
      )

      message.success(
        'Tag created'
      )
    }

    resetModal()

    fetchTags()

  } catch (err: any) {

    message.error(
      err?.message ||
      'Submit failed'
    )

  } finally {
    submitting.value = false
  }
}

const handleDeleteTag = (
  record: Tag
) => {
  Modal.confirm({
    title: 'Delete Tag',

    content: `Delete ${record.name}?`,

    okType: 'danger',

    async onOk() {
      try {

        await deleteTag(record.id)

        message.success(
          'Tag deleted'
        )

        fetchTags()

      } catch (err: any) {

        message.error(
          err?.message ||
          'Delete failed'
        )
      }
    }
  })
}

// ================= WATCH =================
watch(sort, () => {
  page.value = 1
  fetchTags()
})

// ================= TABLE =================
const columns = [
  {
    title: 'Name',
    key: 'name'
  },
  {
    title: 'Created At',
    key: 'createdAt'
  },
  {
    title: 'Action',
    key: 'action'
  }
]

// ================= INIT =================
onMounted(fetchTags)
</script>

<template>
    <client-only>
        <div class="space-y-6">

            <!-- HEADER -->
            <div class="bg-white rounded-2xl">

            <a-page-header
                title="Tag Settings"
                sub-title="Manage product tags"
            >

                <template #breadcrumb>

                <a-breadcrumb>
                    <a-breadcrumb-item>
                    Dashboard
                    </a-breadcrumb-item>

                    <a-breadcrumb-item>
                    Tag Settings
                    </a-breadcrumb-item>
                </a-breadcrumb>

                </template>

                <template #extra>

                <a-button
                    type="primary"
                    @click="openCreateModal"
                >
                    Add Tag
                </a-button>

                </template>

            </a-page-header>

            </div>

            <!-- TABLE -->
            <a-card class="rounded-xl shadow-sm">

            <!-- FILTER -->
            <div class="flex flex-col gap-5">

                <!-- FILTER BAR -->
                <div class="flex flex-col lg:flex-row gap-3 lg:items-center">

                <!-- SEARCH -->
                <a-input
                    v-model:value="search"
                    placeholder="Search tag..."
                    allow-clear
                    class="flex-1"
                >

                    <template #prefix>
                    <Icon name="lucide:search" />
                    </template>

                </a-input>

                <!-- SORT -->
                <a-select
                    v-model:value="sort"
                    class="w-full lg:w-52"
                >

                    <a-select-option value="-created_at">
                    Newest
                    </a-select-option>

                    <a-select-option value="created_at">
                    Oldest
                    </a-select-option>

                    <a-select-option value="name">
                    Name A-Z
                    </a-select-option>

                    <a-select-option value="-name">
                    Name Z-A
                    </a-select-option>

                </a-select>

                <!-- BUTTON -->
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
                <div class="flex justify-between items-center text-sm text-gray-500 border-t pt-4">

                <div>
                    Showing

                    <span class="font-semibold text-black">
                    {{ tags.length }}
                    </span>

                    of

                    <span class="font-semibold text-black">
                    {{ total }}
                    </span>

                    tags
                </div>

                </div>

            </div>

            <!-- TABLE -->
            <a-table
                :columns="columns"
                :data-source="tags"
                :loading="loading"
                row-key="id"
                class="mt-5"
                :pagination="{
                current: page,
                pageSize: limit,
                total: total,
                showSizeChanger: true,
                onChange: handleTableChange
                }"
            >

                <template #bodyCell="{ column, record }">

                <!-- NAME -->
                <template v-if="column.key === 'name'">

                    <div class="font-medium text-gray-800">
                    {{ record.name }}
                    </div>

                </template>

                <!-- CREATED -->
                <template v-else-if="column.key === 'createdAt'">

                    <div>
                    {{ new Date(record.createdAt).toLocaleString() }}
                    </div>

                </template>

                <!-- ACTION -->
                <template v-else-if="column.key === 'action'">

                <div class="flex gap-2">

                    <a-button
                        size="small"
                        @click="openEditModal(record as Tag)"            
                    >
                    Edit
                    </a-button>

                    <a-button
                        danger
                        size="small"
                        @click="handleDeleteTag(record as Tag)"            
                    >
                    Delete
                    </a-button>

                </div>

                </template>

                </template>

            </a-table>

            </a-card>

            <!-- MODAL -->
            <a-modal
            v-model:open="isModalOpen"
            :title="isEditMode ? 'Edit Tag' : 'Add Tag'"
            :ok-text="isEditMode ? 'Update' : 'Create'"
            :confirm-loading="submitting"
            @cancel="resetModal"
            @ok="handleSubmitTag"
            >

            <a-form layout="vertical">

                <a-form-item
                label="Tag Name"
                required
                >

                <a-input
                    v-model:value="formState.name"
                    placeholder="Enter tag name"
                    allow-clear
                />

                </a-form-item>

            </a-form>

            </a-modal>

        </div>
    </client-only>
</template>