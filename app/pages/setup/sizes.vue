<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { useSize } from '~/composables/useSize'

const {
  getSizes,
  createSize,
  updateSize,
  deleteSize
} = useSize()

// ================= STATE =================
const sizes = ref<any[]>([])
const loading = ref(false)
const total = ref(0)

const isModalOpen = ref(false)
const submitting = ref(false)

const isEditMode = ref(false)
const selectedId = ref<number | null>(null)

const formState = ref({
  name: ''
})

// FILTER
const search = ref('')
const sort = ref('-created_at')

// PAGINATION
const page = ref(1)
const limit = ref(10)

// ================= FETCH =================
const fetchSizes = async () => {
  loading.value = true

  try {
    const res = await getSizes({
      page: page.value,
      limit: limit.value,
      orderBy: sort.value,
      name: search.value
    })

    sizes.value = res.sizes || []
    total.value = res.pagination?.totalItems || 0

  } catch (err: any) {

    message.error(
      err?.response?.data?.message || 'Failed fetch sizes'
    )

  } finally {
    loading.value = false
  }
}

// ================= ACTION =================
const applyFilter = () => {
  page.value = 1
  fetchSizes()
}

const resetFilter = () => {
  search.value = ''
  page.value = 1
  fetchSizes()
}

const handleTableChange = (
  p: number,
  l: number
) => {
  page.value = p
  limit.value = l

  fetchSizes()
}

const resetModal = () => {
  isModalOpen.value = false
  isEditMode.value = false
  selectedId.value = null

  formState.value.name = ''
}

const openCreateModal = () => {
  resetModal()
  isModalOpen.value = true
}

const openEditModal = (record: any) => {
  isEditMode.value = true
  selectedId.value = record.id

  formState.value.name = record.name

  isModalOpen.value = true
}

const handleSubmitSize = async () => {
  if (!formState.value.name) {
    message.warning('Name is required')
    return
  }

  submitting.value = true

  try {

    // UPDATE
    if (isEditMode.value && selectedId.value) {

      await updateSize(selectedId.value, {
        name: formState.value.name
      })

      message.success('Size updated')

    } else {

      // CREATE
      await createSize({
        name: formState.value.name
      })

      message.success('Size created')
    }

    resetModal()

    fetchSizes()

  } catch (err: any) {

    message.error(
      err?.response?.data?.message || 'Submit failed'
    )

  } finally {
    submitting.value = false
  }
}

const handleDeleteSize = (record: any) => {
  Modal.confirm({
    title: 'Delete Size',
    content: `Delete ${record.name}?`,
    okType: 'danger',

    async onOk() {
      try {

        await deleteSize(record.id)

        message.success('Size deleted')

        fetchSizes()

      } catch (err: any) {

        message.error(
          err?.response?.data?.message || 'Delete failed'
        )
      }
    }
  })
}

// ================= WATCH =================
watch(sort, () => {
  page.value = 1
  fetchSizes()
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
onMounted(fetchSizes)
</script>

<template>
  <client-only>
    <div class="space-y-6">

      <!-- HEADER -->
      <div class="bg-white rounded-2xl">

        <a-page-header
          title="Sizes Settings"
          sub-title="Manage product sizes"
        >

          <template #breadcrumb>
            <a-breadcrumb>
              <a-breadcrumb-item>Dashboard</a-breadcrumb-item>
              <a-breadcrumb-item>Color Settings</a-breadcrumb-item>
            </a-breadcrumb>
          </template>

          <template #extra>

              <a-button type="primary" @click="openCreateModal">
              Add Sizes
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
              placeholder="Search size..."
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
                {{ sizes.length }}
              </span>

              of

              <span class="font-semibold text-black">
                {{ total }}
              </span>

              sizes
            </div>

          </div>

        </div>

        <a-table
          :columns="columns"
          :data-source="sizes"
          :loading="loading"
          row-key="id"
          :pagination="{
            current: page,
            pageSize: limit,
            total: total,
            showSizeChanger: true,
            onChange: handleTableChange
          }"
          class="mt-5"
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
                  @click="openEditModal(record)"
                >
                  Edit
                </a-button>

                <a-button
                  danger
                  size="small"
                  @click="handleDeleteSize(record)"
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
        :title="isEditMode ? 'Edit Size' : 'Add Size'"
        :ok-text="isEditMode ? 'Update' : 'Create'"
        :confirm-loading="submitting"
        @cancel="resetModal"
        @ok="handleSubmitSize"
      >

        <a-form layout="vertical">

          <a-form-item
            label="Size Name"
            required
          >

            <a-input
              v-model:value="formState.name"
              placeholder="Enter size name"
              allow-clear
            />

          </a-form-item>

        </a-form>

      </a-modal>

    </div>
  </client-only>

</template>