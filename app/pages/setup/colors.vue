<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { useColor } from '~/composables/useColor'
import type { Color, ColorPayload } from '~/type/color'
import type { ApiResponse } from '~/type/api'

useHead({
  title: 'Colors • Dashboard'
})

const { getColors, createColor, updateColor, deleteColor } = useColor()

// ================= STATE =================
const colors = ref<Color[]>([])
const loading = ref(false)
const total = ref(0)

const isModalOpen = ref(false)
const submitting = ref(false)

const isEditMode = ref(false)
const selectedId = ref<number | null>(null)

const formState = ref<ColorPayload>({
  name: '',
  hexCode: '#000000',
})

// ================= FILTER =================
const search = ref('')
const sort = ref('-created_at')

// ================= PAGINATION =================
const page = ref(1)
const limit = ref(10)

// ================= FETCH =================
const fetchColors = async () => {
  loading.value = true

  try {
    const res = await getColors({
      page: page.value,
      limit: limit.value,
      orderBy: sort.value,
      name: search.value,
    })

    const response = res as ApiResponse<{ colors: Color[]; pagination: any }>

    colors.value = response.data?.colors ?? []
    total.value = response.data?.pagination?.totalItems ?? 0
  } catch (err: any) {
    message.error(err?.response?.data?.message || 'Failed fetch colors')
  } finally {
    loading.value = false
  }
}

// ================= ACTION =================
const applyFilter = () => {
  page.value = 1
  fetchColors()
}

const resetFilter = () => {
  search.value = ''
  page.value = 1
  fetchColors()
}

const handleTableChange = (p: number, l: number) => {
  page.value = p
  limit.value = l
  fetchColors()
}

const resetModal = () => {
  isModalOpen.value = false
  isEditMode.value = false
  selectedId.value = null

  formState.value = {
    name: '',
    hexCode: '#000000',
  }
}

const openCreateModal = () => {
  resetModal()
  isModalOpen.value = true
}

const openEditModal = (record: Color) => {
  isEditMode.value = true
  selectedId.value = record.id

  formState.value = {
    name: record.name,
    hexCode: record.hexCode,
  }

  isModalOpen.value = true
}

const handleSubmitColor = async () => {
  if (!formState.value.name)
    return message.warning('Name is required')

  if (!formState.value.hexCode)
    return message.warning('Hex code is required')

  submitting.value = true

  try {
    if (isEditMode.value && selectedId.value) {
      await updateColor(selectedId.value, formState.value)
      message.success('Color updated')
    } else {
      await createColor(formState.value)
      message.success('Color created')
    }

    resetModal()
    fetchColors()
  } catch (err: any) {
    message.error(err?.response?.data?.message || 'Submit failed')
  } finally {
    submitting.value = false
  }
}

const handleDeleteColor = (record: Color) => {
  Modal.confirm({
    title: 'Delete Color',
    content: `Delete ${record.name}?`,
    okType: 'danger',

    async onOk() {
      try {
        await deleteColor(record.name)
        message.success('Color deleted')
        fetchColors()
      } catch (err: any) {
        message.error(err?.response?.data?.message || 'Delete failed')
      }
    },
  })
}

// ================= WATCH =================
watch(sort, () => {
  page.value = 1
  fetchColors()
})

// ================= TABLE =================
const columns = [
  { title: 'Color', key: 'color' },
  { title: 'Hex Code', key: 'hexCode' },
  { title: 'Created At', key: 'createdAt' },
  { title: 'Action', key: 'action' },
]

// ================= INIT =================
onMounted(fetchColors)
</script>

<template>
  <client-only>
    <div class="space-y-6">

      <!-- HEADER -->
      <div class="bg-white rounded-2xl">

        <a-page-header
          title="Color Settings"
          sub-title="Manage product colors"
        >

          <template #breadcrumb>
            <a-breadcrumb>
              <a-breadcrumb-item>Dashboard</a-breadcrumb-item>
              <a-breadcrumb-item>Color Settings</a-breadcrumb-item>
            </a-breadcrumb>
          </template>

          <template #extra>

              <a-button type="primary" @click="openCreateModal">
              Add Color
            </a-button>

          </template>

        </a-page-header>

      </div>

      <!-- TABLE -->
      <a-card class="rounded-xl shadow-sm">

        <div class="flex flex-col gap-5">

          <!-- FILTER BAR -->
          <div class="flex flex-col lg:flex-row gap-3 lg:items-center">

            <!-- SEARCH -->
            <a-input
              v-model:value="search"
              placeholder="Search colors..."
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
                {{ colors.length }}
              </span>

              of

              <span class="font-semibold text-black">
                {{ total }}
              </span>

              colors
            </div>

          </div>

        </div>

        <a-table
          :columns="columns"
          :data-source="colors"
          :loading="loading"
          row-key="id"
          :pagination="{
            current: page,
            pageSize: limit,
            total,
            showSizeChanger: true,
            onChange: handleTableChange,
          }"
        >

          <template #bodyCell="{ column, record }">

            <!-- COLOR -->
            <template v-if="column.key === 'color'">
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-lg border"
                  :style="{ backgroundColor: record.hexCode }"
                />

                <div class="flex flex-col">
                  <span class="font-medium">{{ record.name }}</span>
                  <span class="text-xs text-gray-500 font-mono">
                    {{ record.hexCode }}
                  </span>
                </div>
              </div>
            </template>

            <!-- HEX -->
            <template v-else-if="column.key === 'hexCode'">
              <div class="flex items-center gap-2">
                <div
                  class="w-4 h-4 rounded-full border"
                  :style="{ backgroundColor: record.hexCode }"
                />
                <span class="font-mono text-sm">
                  {{ record.hexCode }}
                </span>
              </div>
            </template>

            <!-- CREATED -->
            <template v-else-if="column.key === 'createdAt'">
              {{ new Date(record.createdAt).toLocaleString() }}
            </template>

            <!-- ACTION (SAFE CAST ONLY HERE) -->
            <template v-else-if="column.key === 'action'">
              <div class="flex gap-2">

                <a-button
                  size="small"
                  @click="openEditModal(record as Color)"
                >
                  Edit
                </a-button>

                <a-button
                  danger
                  size="small"
                  @click="handleDeleteColor(record as Color)"
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
        :title="isEditMode ? 'Edit Color' : 'Add Color'"
        :confirm-loading="submitting"
        @cancel="resetModal"
        @ok="handleSubmitColor"
        class="mt-5"
      >
        <a-form layout="vertical">

          <a-form-item label="Color Name" required>
            <a-input v-model:value="formState.name" />
          </a-form-item>

          <a-form-item label="Hex Code" required>
            <div class="flex gap-3 items-center">
              <input
                v-model="formState.hexCode"
                type="color"
                class="w-12 h-10 border rounded"
              />

              <a-input v-model:value="formState.hexCode" />
            </div>
          </a-form-item>

        </a-form>
      </a-modal>

    </div>
  </client-only>
</template>