<script setup lang="ts">
import { message } from "ant-design-vue"
import type { UploadProps } from "ant-design-vue"
import {
  PlusOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  UploadOutlined,
  EditOutlined,
} from "@ant-design/icons-vue"
import type { OemProduct, OemSectionPayload } from "~/composables/useOEM"

useHead({ title: "OEM product • Dashboard" })

interface OemProductForm extends OemProduct {
  id: string
}

interface OemForm {
  title: string
  subtitle: string
  content: OemProductForm[]
}

const { getOemSection, createOemSection, updateOemSection } = useOemSection()
const { uploadImage } = useUpload()

const loading = ref(false)
const saving = ref(false)
const productSaving = ref(false)
const productImageLoading = ref(false)
const isExisting = ref(false)
const previewFileUrls = reactive<Record<string, string>>({})
const productModalOpen = ref(false)
const editingProductId = ref<string | null>(null)
const productPreview = ref("")

const form = reactive<OemForm>({
  title: "",
  subtitle: "",
  content: [],
})

const productForm = reactive<OemProduct>({
  productName: "",
  description: "",
  image: "",
})

const productColumns = [
  { title: "Image", key: "image", width: 100 },
  { title: "Product Name", key: "productName", dataIndex: "productName", width: 180 },
  { title: "Description", key: "description", dataIndex: "description" },
  { title: "Actions", key: "actions", width: 160 },
]

const loadOemSection = async () => {
  loading.value = true

  try {
    const response = await getOemSection()

    form.title = response.title ?? ""
    form.subtitle = response.subtitle ?? ""
    form.content = (response.content ?? []).map((product) => ({
      ...product,
      id: crypto.randomUUID(),
    }))

    isExisting.value = true
  } catch (error) {
    console.error("Failed to load OEM section:", error)
    isExisting.value = false
  } finally {
    loading.value = false
  }
}

const handleAddProduct = () => {
  editingProductId.value = null
  productForm.productName = ""
  productForm.description = ""
  productForm.image = ""
  productPreview.value = ""
  productModalOpen.value = true
}

const handleEditProductRecord = (record: Record<string, any>) => {
  const product = record as OemProductForm

  editingProductId.value = product.id
  productForm.productName = product.productName
  productForm.description = product.description
  productForm.image = product.image
  productPreview.value = previewFileUrls[product.id] || ""
  productModalOpen.value = true
}

const handleModalImageUpload: UploadProps["beforeUpload"] = async (file) => {
  productImageLoading.value = true

  try {
    const reader = new FileReader()

    reader.onload = (event: ProgressEvent<FileReader>) => {
      productPreview.value = event.target?.result as string
    }

    reader.readAsDataURL(file)

    const response: any = await uploadImage(file)
    const imageUrl = response?.data?.url || response?.url

    if (!imageUrl) {
      message.error("Image URL not found in upload response")
      return false
    }

    productForm.image = imageUrl
    message.success("Upload success")
  } catch (error) {
    console.error("Upload failed:", error)
    message.error("Upload failed")
  } finally {
    productImageLoading.value = false
  }

  return false
}

const handleProductSubmit = () => {
  if (!productForm.productName.trim()) {
    message.warning("Product name is required")
    return
  }

  if (!productForm.image.trim()) {
    message.warning("Product image is required")
    return
  }

  const productData: OemProduct = {
    productName: productForm.productName.trim(),
    description: productForm.description.trim(),
    image: productForm.image.trim(),
  }

  if (editingProductId.value) {
    const productId = editingProductId.value
    const index = form.content.findIndex((product) => product.id === productId)

    if (index !== -1) {
      form.content[index] = {
        id: productId,
        ...productData,
      }

      if (productPreview.value.startsWith("data:")) {
        previewFileUrls[productId] = productPreview.value
      } else {
        delete previewFileUrls[productId]
      }
    }
  } else {
    const product: OemProductForm = {
      id: crypto.randomUUID(),
      ...productData,
    }

    form.content.push(product)

    if (productPreview.value.startsWith("data:")) {
      previewFileUrls[product.id] = productPreview.value
    }
  }

  productModalOpen.value = false
  message.success(editingProductId.value ? "Product updated" : "Product added")
}

const handleProductCancel = () => {
  productModalOpen.value = false
  productPreview.value = ""
}

const handleDeleteProduct = (index: number) => {
  const product = form.content[index]

  if (product) {
    delete previewFileUrls[product.id]
  }

  form.content.splice(index, 1)
}

const moveProduct = (index: number, direction: number) => {
  const targetIndex = index + direction

  if (targetIndex < 0 || targetIndex >= form.content.length) return

  const currentProduct = form.content[index]
  const targetProduct = form.content[targetIndex]

  if (!currentProduct || !targetProduct) return

  form.content[index] = targetProduct
  form.content[targetIndex] = currentProduct
}

const handleImageError = (event: Event) => {
  const image = event.target as HTMLImageElement
  image.style.display = "none"
}

const handleSave = async () => {
  console.log("Save Changes clicked")
  console.log("isExisting:", isExisting.value)

  if (!form.title.trim()) {
    message.warning("Section title is required")
    return
  }

  const invalidProduct = form.content.some(
    (product) => !product.productName.trim() || !product.image.trim(),
  )

  if (invalidProduct) {
    message.warning("Product name and image are required")
    return
  }

  const payload: OemSectionPayload = {
    title: form.title.trim(),
    subtitle: form.subtitle.trim(),
    content: form.content.map(({ productName, description, image }) => ({
      productName: productName.trim(),
      description: description.trim(),
      image: image.trim(),
    })),
  }

  saving.value = true

  try {
    if (isExisting.value) {
      await updateOemSection(payload)
    } else {
      await createOemSection(payload)
    }

    isExisting.value = true
    message.success("OEM section saved successfully")
  } catch (error) {
    console.error("Failed to save OEM section:", error)
    message.error("Failed to save OEM section")
  } finally {
    saving.value = false
  }
}

onMounted(loadOemSection)
</script>

<template>
  <div class="p-6">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800">OEM Products</h1>
        <p class="mt-1 text-sm text-gray-500">Manage homepage OEM product section</p>
      </div>
      <a-button type="primary" :loading="saving" @click="handleSave">Save Changes</a-button>
    </div>

    <a-spin :spinning="loading">
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="lg:col-span-1">
          <a-card title="Section Information" class="rounded-lg">
            <a-form layout="vertical">
              <a-form-item label="Section Title" required>
                <a-input v-model:value="form.title" placeholder="Enter section title" :maxlength="150" />
              </a-form-item>
              <a-form-item label="Section Subtitle">
                <a-textarea v-model:value="form.subtitle" placeholder="Enter section subtitle" :rows="4" :maxlength="500" />
              </a-form-item>
            </a-form>
          </a-card>
        </div>

        <div class="lg:col-span-2">
          <a-card class="rounded-lg">
            <template #title>
              <div class="flex items-center justify-between gap-3">
                <span>Product List</span>
                <a-button type="primary" @click="handleAddProduct">
                  <template #icon><PlusOutlined /></template>
                  Add Product
                </a-button>
              </div>
            </template>

            <a-table
              :columns="productColumns"
              :data-source="form.content"
              :pagination="{ pageSize: 5, showSizeChanger: false }"
              :scroll="{ x: 700 }"
              row-key="id"
            >
              <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'image'">
                  <img
                    v-if="record.image"
                    :src="previewFileUrls[record.id] || record.image"
                    :alt="record.productName || 'OEM product'"
                    class="h-14 w-16 rounded-md border border-gray-200 object-contain p-1"
                    @error="handleImageError"
                  />
                  <span v-else class="text-gray-400">No image</span>
                </template>

                <template v-else-if="column.key === 'productName'">
                  <span class="font-medium text-gray-800">{{ record.productName || "-" }}</span>
                </template>

                <template v-else-if="column.key === 'description'">
                  <a-tooltip :title="record.description">
                    <span class="block max-w-xs truncate">{{ record.description || "-" }}</span>
                  </a-tooltip>
                </template>

                <template v-else-if="column.key === 'actions'">
                  <div class="flex items-center gap-1">
                    <a-tooltip title="Move up">
                      <a-button type="text" :disabled="index === 0" @click="moveProduct(index, -1)">
                        <template #icon><ArrowUpOutlined /></template>
                      </a-button>
                    </a-tooltip>
                    <a-tooltip title="Move down">
                      <a-button type="text" :disabled="index === form.content.length - 1" @click="moveProduct(index, 1)">
                        <template #icon><ArrowDownOutlined /></template>
                      </a-button>
                    </a-tooltip>
                    <a-button type="text" @click="handleEditProductRecord(record)">
                        <template #icon>
                            <EditOutlined />
                        </template>
                    </a-button>
                    <a-popconfirm
                      title="Delete this product?"
                      ok-text="Delete"
                      cancel-text="Cancel"
                      @confirm="handleDeleteProduct(index)"
                    >
                      <a-button danger type="text">
                        <template #icon><DeleteOutlined /></template>
                      </a-button>
                    </a-popconfirm>
                  </div>
                </template>
              </template>

              <template #emptyText>
                <a-empty description="No products added yet" />
              </template>
            </a-table>
          </a-card>
        </div>
      </div>
    </a-spin>

    <a-modal
      v-model:open="productModalOpen"
      :title="editingProductId ? 'Edit Product' : 'Add Product'"
      ok-text="Save"
      cancel-text="Cancel"
      :confirm-loading="productSaving"
      @ok="handleProductSubmit"
      @cancel="handleProductCancel"
    >
      <a-form layout="vertical" class="mt-4">
        <a-form-item label="Product Name" required>
          <a-input v-model:value="productForm.productName" placeholder="Enter product name" :maxlength="150" />
        </a-form-item>

        <a-form-item label="Description">
          <a-textarea v-model:value="productForm.description" placeholder="Enter product description" :rows="3" :maxlength="1000" />
        </a-form-item>

        <a-form-item label="Product Image" required>
          <a-upload accept="image/*" :show-upload-list="false" :before-upload="handleModalImageUpload">
            <a-button :loading="productImageLoading">
              <template #icon><UploadOutlined /></template>
              Upload Image
            </a-button>
          </a-upload>

          <img
            v-if="productPreview || productForm.image"
            :src="productPreview || productForm.image"
            alt="Product preview"
            class="mt-3 h-40 w-full rounded-lg border border-gray-200 object-contain p-2"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
