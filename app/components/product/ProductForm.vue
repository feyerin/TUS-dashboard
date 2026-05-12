<script setup lang="ts">
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import type { UploadFile } from 'ant-design-vue'
import RichText from '../global/richText.vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },

  mode: {
    type: String,
    default: 'create'
  },

  initialValues: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['submit'])

// ================= MASTER DATA =================
const {
  categories,
  colors,
  sizes,
  brands,
  tags
} = useMasterData()

const { uploadFile } = useProductApi()

const isEdit = props.mode === 'edit'

// ================= FORM =================
const form = ref({
  name: '',
  description: '',
  status: 'draft',
  brandId: undefined,
  categoryIds: [],
  seoTag: [] as string[],
  basePrice: undefined,
  discountType: '',
  discountValue: undefined
})

// ================= VARIANT =================
const variant = ref({
  sizes: [],
  colors: []
})

// ================= LINKS =================
const links = ref([
  {
    label: '',
    linkType: '',
    url: ''
  }
])

// ================= MEDIA =================
const mediaList = ref<any[]>([])
const thumbnailList = ref<any[]>([])

// ================= ERROR =================
const errors = ref<Record<string, boolean>>({})

// ================= PREVIEW =================
const previewImage = ref('')
const previewOpen = ref(false)

// ================= INIT =================
watch(
  () => props.initialValues,
  value => {
    if (!value) return

    form.value = {
      name: value.name || '',
      description: value.description || '',
      status: value.status || 'draft',
      brandId: value.brandId || undefined,
      categoryIds: value.categoryIds || [],
      seoTag: value.seoTag || [],
      basePrice: value.basePrice || 0,
      discountType: value.discountType || '',
      discountValue: value.discountValue || 0
    }

    console.log(value)

    variant.value = {
      sizes: value.sizes || [],
      colors: value.colors || []
    }

    links.value =
      value.links?.length
        ? value.links
        : [
            {
              label: '',
              linkType: '',
              url: ''
            }
          ]

    thumbnailList.value =
      value.imageUrl
        ? [
            {
              uid: 'thumbnail',
              name: 'thumbnail',
              url: value.imageUrl,
              status: 'done'
            }
          ]
        : []

    mediaList.value =
      value.coverImages?.map(
        (
          url: string,
          index: number
        ) => ({
          uid: String(index),
          name: `image-${index}`,
          url,
          status: 'done'
        })
      ) || []
  },
  {
    immediate: true
  }
)

// ================= PREVIEW =================
const handlePreview = (
  file: UploadFile
) => {
  previewImage.value =
    file.url ||
    (file.response as any)?.url ||
    file.thumbUrl ||
    ''

  previewOpen.value = true
}

// ================= UPLOAD =================
const upload = async (
  file: File
) => {
  return await uploadFile(file)
}

// ================= MEDIA =================
const handleMediaUpload = async (
  options: any
) => {
  const {
    file,
    onSuccess,
    onError
  } = options

  try {
    const url = await upload(file)

    mediaList.value = [
      ...mediaList.value,
      {
        uid: file.uid,
        name: file.name,
        url,
        response: { url },
        status: 'done'
      }
    ]

    onSuccess?.({ url })
  } catch (err) {
    onError?.(err)
  }
}

// ================= THUMB =================
const handleThumbnailUpload = async (
  options: any
) => {
  const {
    file,
    onSuccess,
    onError
  } = options

  try {
    const url = await upload(file)

    thumbnailList.value = [
      {
        uid: file.uid,
        name: file.name,
        url,
        response: { url },
        status: 'done'
      }
    ]

    onSuccess?.({ url })
  } catch (err) {
    onError?.(err)
  }
}

// ================= VALIDATE =================
const validate = () => {
  errors.value = {}

  if (!form.value.name) {
    errors.value.name = true
  }

  if (!form.value.description) {
    errors.value.description = true
  }

  if (!form.value.brandId) {
    errors.value.brandId = true
  }

  if (!form.value.categoryIds.length) {
    errors.value.categoryIds = true
  }

  if (!form.value.basePrice) {
    errors.value.basePrice = true
  }

  if (!mediaList.value.length) {
    errors.value.media = true
  }

  if (!thumbnailList.value.length) {
    errors.value.thumbnail = true
  }

  if (Object.keys(errors.value).length) {
    message.error(
      'Please complete required fields'
    )

    return false
  }

  return true
}

// ================= SUBMIT =================
const submit = () => {
  const valid = validate()

  if (!valid) return

  emit('submit', {
    name: form.value.name,
    description: form.value.description,
    basePrice: Number(
      form.value.basePrice || 0
    ),
    brandId: form.value.brandId,
    categoryIds: form.value.categoryIds,
    colors: variant.value.colors,
    coverImages: mediaList.value.map(
      i =>
        i.response?.url || i.url
    ),
    discountType:
      form.value.discountType,
    discountValue: Number(
      form.value.discountValue || 0
    ),
    imageUrl:
      thumbnailList.value?.[0]
        ?.response?.url ||
      thumbnailList.value?.[0]
        ?.url ||
      '',
    links: links.value,
    seoTag: form.value.seoTag,
    sizes: variant.value.sizes,
    status: form.value.status
  })
}
</script>

<template>
  <client-only>
    <div>

      <!-- HEADER -->
      <div class="bg-[#f0f9ff] rounded-2xl mb-4 sticky top-0 z-40">
        <a-page-header
            :title="
            isEdit
                ? 'Edit Product'
                : 'Create Product'
            "
            :sub-title="
            isEdit
                ? 'Update your product details'
                : 'Add your product and details'
            "
            class="bg-white rounded-2xl"
        >
            <template #extra>
            <a-button
                type="primary"
                :loading="loading"
                class="rounded-md"
                @click="submit"
            >
                {{
                isEdit
                    ? 'Save Changes'
                    : 'Save Product'
                }}
            </a-button>
            </template>
        </a-page-header>
      </div>

      <!-- GRID -->
      <a-row :gutter="[16, 16]">

        <!-- LEFT -->
        <a-col :xs="24" :md="16">

          <!-- GENERAL -->
          <a-card class="mb-4 rounded-2xl">

            <template #title>
              <span>
                General
                <span class="text-red-500">*</span>
              </span>
            </template>

            <a-form layout="vertical">

              <!-- NAME -->
              <a-form-item
                label="Product Name"
                required
              >
                <a-input
                  v-model:value="form.name"
                  class="rounded-md"
                  :status="
                    errors.name
                      ? 'error'
                      : ''
                  "
                  @input="
                    errors.name = false
                  "
                />
              </a-form-item>

              <!-- DESCRIPTION -->
              <a-form-item
                label="Description"
                required
              >

                <div
                  :class="[
                    errors.description
                      ? 'border border-red-500 rounded-lg'
                      : ''
                  ]"
                >
                  <RichText
                    v-model="
                      form.description
                    "
                  />
                </div>

              </a-form-item>

            </a-form>

          </a-card>

          <!-- MEDIA -->
          <a-card class="mb-4 rounded-2xl">

            <template #title>
              <span class="pt-2">
                Media
                <span class="text-red-500">*</span>
              </span>
            </template>

            <div
              :class="[
                errors.media
                  ? 'border border-red-500 rounded-lg p-2'
                  : ''
              ]"
            >

              <a-upload
                v-model:file-list="mediaList"
                list-type="picture-card"
                multiple
                :custom-request="
                  handleMediaUpload
                "
                :on-preview="
                  handlePreview
                "
              >
                <div>Upload</div>
              </a-upload>

            <span class="text-xs text-gray-400 font-secondary font-normal italic text-end mt-1">
                Recommended image ratio: 3:2
            </span>
            </div>

          </a-card>

          <!-- VARIANTS -->
          <a-card class="mb-4 rounded-2xl">

            <template #title>
              <span>
                Variants
                <span class="text-red-500">*</span>
              </span>
            </template>

            <div class="space-y-4">

              <!-- SIZE -->
              <div>

                <p class="text-sm font-medium mb-2">
                  Sizes
                  <span class="text-red-500">*</span>
                </p>

                <a-select
                  v-model:value="
                    variant.sizes
                  "
                  mode="multiple"
                  class="w-full rounded-md"
                  :options="
                    sizes.map(s => ({
                      label: s.name,
                      value: s.name
                    }))
                  "
                />

              </div>

              <!-- COLOR -->
              <div>

                <p class="text-sm font-medium mb-2">
                  Colors
                  <span class="text-red-500">*</span>
                </p>

                <a-select
                  v-model:value="
                    variant.colors
                  "
                  mode="multiple"
                  class="w-full rounded-md"
                  :options="
                    colors.map(c => ({
                      label: c.name,
                      value: c.name
                    }))
                  "
                />

              </div>

            </div>

          </a-card>

          <!-- MARKETPLACE LINKS -->
          <a-card class="mb-4 rounded-2xl">

            <template #title>
              <span>
                Marketplace Links
                <span class="text-red-500">*</span>
              </span>
            </template>

            <div class="space-y-4">

              <div
                v-for="(
                  link,
                  index
                ) in links"
                :key="index"
                class="border rounded-xl p-4 space-y-3"
              >

                <!-- TOP -->
                <div
                  class="flex items-center justify-between"
                >

                  <div
                    class="font-medium text-sm"
                  >
                    Link #{{ index + 1 }}
                  </div>

                  <a-button
                    danger
                    type="text"
                    @click="
                      links.splice(
                        index,
                        1
                      )
                    "
                    v-if="
                      links.length > 1
                    "
                  >
                    Remove
                  </a-button>

                </div>

                <!-- LABEL -->
                <div>

                  <p
                    class="text-sm font-medium mb-2"
                  >
                    Label
                    <span
                      class="text-red-500"
                    >*</span>
                  </p>

                  <a-input
                    v-model:value="
                      link.label
                    "
                    placeholder="Tokopedia Official"
                    class="rounded-md"
                  />

                </div>

                <!-- TYPE -->
                <div>

                  <p
                    class="text-sm font-medium mb-2"
                  >
                    Marketplace
                    <span
                      class="text-red-500"
                    >*</span>
                  </p>

                  <a-select
                    v-model:value="
                      link.linkType
                    "
                    placeholder="Select marketplace"
                    class="w-full rounded-md"
                  >

                    <a-select-option value="tokopedia">
                      Tokopedia
                    </a-select-option>

                    <a-select-option value="shopee">
                      Shopee
                    </a-select-option>

                    <a-select-option value="tiktok">
                      TikTok Shop
                    </a-select-option>

                    <a-select-option value="lazada">
                      Lazada
                    </a-select-option>

                    <a-select-option value="blibli">
                      Blibli
                    </a-select-option>

                  </a-select>

                </div>

                <!-- URL -->
                <div>

                  <p
                    class="text-sm font-medium mb-2"
                  >
                    URL
                    <span
                      class="text-red-500"
                    >*</span>
                  </p>

                  <a-input
                    v-model:value="
                      link.url
                    "
                    placeholder="https://..."
                    class="rounded-md"
                  />

                </div>

              </div>

              <!-- ADD -->
              <a-button
                block
                class="rounded-md"
                @click="
                  links.push({
                    label: '',
                    linkType: '',
                    url: ''
                  })
                "
              >
                + Add Marketplace Link
              </a-button>

            </div>

          </a-card>

          <!-- PRICING -->
          <a-card class="rounded-2xl">

            <template #title>
              <span>
                Pricing
                <span class="text-red-500">*</span>
              </span>
            </template>

            <a-form layout="vertical">

              <!-- BASE PRICE -->
              <a-form-item
                label="Base Price"
                required
              >

                <a-input-number
                  v-model:value="
                    form.basePrice
                  "
                  class="w-full rounded-md"
                  :status="
                    errors.basePrice
                      ? 'error'
                      : ''
                  "
                  @change="
                    errors.basePrice = false
                  "
                />

              </a-form-item>

              <!-- DISCOUNT TYPE -->
              <a-form-item
                label="Discount Type"
                required
              >

                <a-radio-group
                  v-model:value="
                    form.discountType
                  "
                >
                  <a-radio value="">
                    No Discount
                  </a-radio>

                  <a-radio value="percentage">
                    Percentage
                  </a-radio>

                  <a-radio value="fixed">
                    Fixed
                  </a-radio>
                </a-radio-group>

              </a-form-item>

              <!-- DISCOUNT VALUE -->
              <a-form-item
                label="Discount Value"
                required
              >

                <a-input-number
                  v-model:value="
                    form.discountValue
                  "
                  class="w-full rounded-md"
                />

              </a-form-item>

            </a-form>

          </a-card>

        </a-col>

        <!-- RIGHT -->
        <a-col :xs="24" :md="8">

          <!-- THUMBNAIL -->
          <a-card class="mb-4 rounded-2xl">

            <template #title>
              <span>
                Thumbnail
                <span class="text-red-500">*</span>
              </span>
            </template>

            <div
              :class="[
                errors.thumbnail
                  ? 'border border-red-500 rounded-lg p-2'
                  : ''
              ]"
            >

              <a-upload
                v-model:file-list="
                  thumbnailList
                "
                list-type="picture-card"
                :max-count="1"
                :custom-request="
                  handleThumbnailUpload
                "
                :on-preview="
                  handlePreview
                "
              >
                <div>Upload</div>
              </a-upload>

            </div>

            <span class="text-xs text-gray-400 font-secondary font-normal italic text-end mt-1">
                Recommended image ratio: 3:2
            </span>

          </a-card>

          <!-- STATUS -->
          <a-card class="mb-4 rounded-2xl">

            <template #title>
              <span>
                Status
                <span class="text-red-500">*</span>
              </span>
            </template>

            <a-select
              v-model:value="form.status"
              class="w-full rounded-md"
            >
              <a-select-option value="draft">
                Draft
              </a-select-option>

              <a-select-option value="published">
                Published
              </a-select-option>
            </a-select>

          </a-card>

          <!-- BRAND -->
          <a-card class="mb-4 rounded-2xl">

            <template #title>
              <span>
                Brand
                <span class="text-red-500">*</span>
              </span>
            </template>

            <a-select
              v-model:value="form.brandId"
              placeholder="Select brand"
              allow-clear
              class="w-full rounded-md"
              :status="
                errors.brandId
                  ? 'error'
                  : ''
              "
              @change="
                errors.brandId = false
              "
            >
              <a-select-option
                v-for="b in brands"
                :key="b.id"
                :value="b.id"
              >
                {{ b.name }}
              </a-select-option>
            </a-select>

          </a-card>

          <!-- CATEGORY + SEO -->
          <a-card class="rounded-2xl">

            <template #title>
              <span>
                Category & SEO
                <span class="text-red-500">*</span>
              </span>
            </template>

            <!-- CATEGORY -->
            <div class="mb-4">

              <p
                class="text-sm font-medium mb-2"
              >
                Categories
                <span
                  class="text-red-500"
                >*</span>
              </p>

              <a-select
                v-model:value="
                  form.categoryIds
                "
                mode="multiple"
                class="w-full rounded-md"
                :status="
                  errors.categoryIds
                    ? 'error'
                    : ''
                "
                @change="
                  errors.categoryIds = false
                "
                :options="
                  categories.map(c => ({
                    label: c.name,
                    value: c.id
                  }))
                "
              />

            </div>

            <!-- SEO -->
            <div>

              <p
                class="text-sm font-medium mb-2"
              >
                Tags
                <span
                  class="text-red-500"
                >*</span>
              </p>

              <!-- TAGS SECTION -->
              <div>
                <a-select
                  v-model:value="form.seoTag"
                  mode="multiple"
                  placeholder="Select tags"
                  class="w-full rounded-md"
                  :options="
                    tags.map(tag => ({
                      label: tag.name,
                      value: tag.name
                    }))
                  "
                />
              </div>

            </div>

          </a-card>

        </a-col>

      </a-row>

      <!-- PREVIEW -->
      <a-modal
        v-model:open="previewOpen"
        :footer="null"
      >
        <img
          :src="previewImage"
          class="w-full rounded-lg"
        />
      </a-modal>

    </div>
  </client-only>
</template>