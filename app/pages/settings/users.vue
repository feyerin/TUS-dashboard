<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { message, Modal, Tag } from 'ant-design-vue'
import { useUser } from '~/composables/useUser'

useHead({
  title: 'Users • Dashboard'
})

// ================= API =================
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} = useUser()

// ================= STATE =================
const users = ref<any[]>([])
const loading = ref(false)
const total = ref(0)

const isModalOpen = ref(false)
const submitting = ref(false)

const isEditMode = ref(false)
const selectedId = ref<string | null>(null)

const formState = ref({
  name: '',
  email: '',
  password: '',
  role: 'admin',
  status: 'active'
})

// ================= FILTER =================
const search = ref('')
const sort = ref('-created_at')

// ================= PAGINATION =================
const page = ref(1)
const limit = ref(10)

// ================= FETCH =================
const fetchUsers = async () => {
  loading.value = true

  try {
    const res = await getUsers({
      page: page.value,
      limit: limit.value,
      orderBy: sort.value,
    })

    users.value = res.users || []
    total.value =
      res.pagination?.totalItems || 0


      console.log(res)

  } catch (err: any) {

    message.error(
      err?.response?.data?.message ||
      'Failed fetch users'
    )

  } finally {
    loading.value = false
  }
}

// ================= ACTION =================
const applyFilter = () => {
  page.value = 1
  fetchUsers()
}

const resetFilter = () => {
  search.value = ''
  page.value = 1
  fetchUsers()
}

const handleTableChange = (
  p: number,
  l: number
) => {
  page.value = p
  limit.value = l

  fetchUsers()
}

const resetModal = () => {
  isModalOpen.value = false
  isEditMode.value = false
  selectedId.value = null

  formState.value = {
    name: '',
    email: '',
    password: '',
    role: 'admin',
    status: 'active'
  }
}

const openCreateModal = () => {
  resetModal()
  isModalOpen.value = true
}

const openEditModal = (record: any) => {
  isEditMode.value = true
  selectedId.value = record.id

  formState.value = {
    name: record.name,
    email: record.email,
    password: '',
    role: record.role,
    status: record.status
  }

  isModalOpen.value = true
}

// ================= SUBMIT =================
const handleSubmitUser = async () => {

  if (
    !formState.value.name ||
    !formState.value.email
  ) {
    message.warning(
      'Please complete required fields'
    )

    return
  }

  if (
    !isEditMode.value &&
    !formState.value.password
  ) {
    message.warning(
      'Password is required'
    )

    return
  }

  submitting.value = true

  try {

    const payload: any = {
      name: formState.value.name,
      email: formState.value.email,
      role: formState.value.role,
      status: formState.value.status
    }

    if (formState.value.password) {
      payload.password =
        formState.value.password
    }

    // UPDATE
    if (
      isEditMode.value &&
      selectedId.value
    ) {

      await updateUser(
        selectedId.value,
        payload
      )

      message.success('User updated')

    } else {

      // CREATE
      await createUser(payload)

      message.success('User created')
    }

    resetModal()

    fetchUsers()

  } catch (err: any) {

    message.error(
      err?.response?.data?.message ||
      'Submit failed'
    )

  } finally {
    submitting.value = false
  }
}

// ================= DELETE =================
const handleDeleteUser = (
  record: any
) => {
  Modal.confirm({
    title: 'Delete User',
    content: `Delete ${record.name}?`,
    okType: 'danger',

    async onOk() {

      try {

        await deleteUser(record.id)

        message.success('User deleted')

        fetchUsers()

      } catch (err: any) {

        message.error(
          err?.response?.data?.message ||
          'Delete failed'
        )
      }
    }
  })
}

// ================= WATCH =================
watch(sort, () => {
  page.value = 1
  fetchUsers()
})

// ================= TABLE =================
const columns = [
  {
    title: 'Name',
    key: 'name'
  },
  {
    title: 'Email',
    key: 'email'
  },
  {
    title: 'Role',
    key: 'role'
  },
  {
    title: 'Status',
    key: 'status'
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
onMounted(fetchUsers)
</script>

<template>
  <client-only>
    <div class="space-y-6">

      <!-- HEADER -->
      <div class="bg-white rounded-2xl">

        <a-page-header
          title="User Settings"
          sub-title="Manage dashboard users"
        >

          <template #breadcrumb>
            <a-breadcrumb>
              <a-breadcrumb-item>
                Dashboard
              </a-breadcrumb-item>

              <a-breadcrumb-item>
                Users
              </a-breadcrumb-item>
            </a-breadcrumb>
          </template>

          <template #extra>

            <a-button
              type="primary"
              @click="openCreateModal"
            >
              Add User
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
              placeholder="Search user..."
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

          <!-- INFO -->
          <div class="flex justify-between items-center text-sm text-gray-500 border-t pt-4">

            <div>
              Showing

              <span class="font-semibold text-black">
                {{ users.length }}
              </span>

              of

              <span class="font-semibold text-black">
                {{ total }}
              </span>

              users
            </div>

          </div>

        </div>

        <!-- TABLE -->
        <a-table
          :columns="columns"
          :data-source="users"
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
            <template
              v-if="column.key === 'name'"
            >

              <div class="font-medium text-gray-800">
                {{ record.name }}
              </div>

            </template>

            <!-- EMAIL -->
            <template
              v-else-if="column.key === 'email'"
            >

              <div>
                {{ record.email }}
              </div>

            </template>

            <!-- ROLE -->
            <template
              v-else-if="column.key === 'role'"
            >

              <a-tag color="blue">
                {{ record.role }}
              </a-tag>

            </template>

            <!-- STATUS -->
            <template
              v-else-if="column.key === 'status'"
            >

              <a-tag
                :color="
                  record.status === 'active'
                    ? 'green'
                    : 'red'
                "
              >
                {{ record.status }}
              </a-tag>

            </template>

            <!-- CREATED -->
            <template
              v-else-if="column.key === 'createdAt'"
            >

              <div>
                {{
                  new Date(
                    record.createdAt
                  ).toLocaleString()
                }}
              </div>

            </template>

            <!-- ACTION -->
            <template
              v-else-if="column.key === 'action'"
            >

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
                    handleDeleteUser(record)
                  "
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
        :title="
          isEditMode
            ? 'Edit User'
            : 'Add User'
        "
        :ok-text="
          isEditMode
            ? 'Update'
            : 'Create'
        "
        :confirm-loading="submitting"
        @cancel="resetModal"
        @ok="handleSubmitUser"
      >

        <a-form layout="vertical">

          <!-- NAME -->
          <a-form-item
            label="Name"
            required
          >

            <a-input
              v-model:value="
                formState.name
              "
              placeholder="Enter name"
            />

          </a-form-item>

          <!-- EMAIL -->
          <a-form-item
            label="Email"
            required
          >

            <a-input
              v-model:value="
                formState.email
              "
              placeholder="Enter email"
            />

          </a-form-item>

          <!-- PASSWORD -->
          <a-form-item
            :label="
              isEditMode
                ? 'Password (optional)'
                : 'Password'
            "
            :required="!isEditMode"
          >

            <a-input-password
              v-model:value="
                formState.password
              "
              placeholder="Enter password"
            />

          </a-form-item>

          <!-- ROLE -->
          <a-form-item
            label="Role"
            required
          >

            <a-select
              v-model:value="
                formState.role
              "
            >

              <a-select-option value="admin">
                Admin
              </a-select-option>

              <a-select-option value="staff">
                Staff
              </a-select-option>

            </a-select>

          </a-form-item>

          <!-- STATUS -->
          <a-form-item
            label="Status"
            required
          >

            <a-select
              v-model:value="
                formState.status
              "
            >

              <a-select-option value="active">
                Active
              </a-select-option>

              <a-select-option value="inactive">
                Inactive
              </a-select-option>

            </a-select>

          </a-form-item>

        </a-form>

      </a-modal>

    </div>
  </client-only>
</template>