<script setup lang="ts">
import { ref, computed } from 'vue'

interface Product {
  id: string
  name: string
  imageUrl: string
  basePrice: number
  description?: string
  slug?: string
  status?: string
}

const props = defineProps<{
  open: boolean
  products?: Product[]
  selected: Product[]
}>()

const emit = defineEmits<{
  (
    e: 'update:open',
    value: boolean
  ): void

  (
    e: 'change',
    value: Product[]
  ): void
}>()

const search = ref('')

const filtered = computed(() => {
  return (
    props.products || []
  ).filter(product =>
    product.name
      .toLowerCase()
      .includes(
        search.value.toLowerCase()
      )
  )
})

const columns = [
  {
    title: 'Image',
    dataIndex: 'imageUrl',
    key: 'imageUrl',
    width: 100
  },
  {
    title: 'Product Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Price',
    dataIndex: 'basePrice',
    key: 'basePrice',
    width: 160
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 120
  }
]

const handleOpenChange = (
  val: boolean
) => {
  emit('update:open', val)
}

const handleSelectChange = (
  _: (string | number)[],
  rows: Product[]
) => {
  emit('change', rows)
}
</script>

<template>
  <a-modal
    :open="open"
    title="Pilih Produk"
    width="900px"
    @update:open="
      handleOpenChange
    "
  >
    <div class="space-y-4">
      <a-input
        v-model:value="search"
        placeholder="Search product..."
      />

      <a-table
        :columns="columns"
        :data-source="filtered"
        row-key="id"
        :pagination="{
          pageSize: 5
        }"
        :scroll="{ y: 400 }"
        :row-selection="{
          selectedRowKeys:
            selected.map(
              p => p.id
            ),
          onChange:
            handleSelectChange
        }"
      >
        <template
          #bodyCell="{
            column,
            record
          }"
        >
          <template
            v-if="
              column.dataIndex ===
              'imageUrl'
            "
          >
            <img
              :src="
                record.imageUrl
              "
              class="w-14 h-14 object-cover rounded-lg border"
            >
          </template>

          <template
            v-if="
              column.dataIndex ===
              'basePrice'
            "
          >
            Rp
            {{
              Number(
                record.basePrice
              ).toLocaleString(
                'id-ID'
              )
            }}
          </template>

          <template
            v-if="
              column.dataIndex ===
              'status'
            "
          >
            <a-tag
              :color="
                record.status ===
                'published'
                  ? 'green'
                  : 'orange'
              "
            >
              {{
                record.status
              }}
            </a-tag>
          </template>
        </template>
      </a-table>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <a-button
          type="primary"
          @click="
            handleOpenChange(
              false
            )
          "
        >
          Selesai
        </a-button>
      </div>
    </template>
  </a-modal>
</template>