<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import type { UploadFile } from 'ant-design-vue'

type UploadResponse = {
  data: {
    url: string
  }
}

type SectionResponse = {
  data?: {
    content?: string[]
  }
}

const {
  updateSection,
  getSection,
  DYNAMIC_SECTION_KEY
} = useDynamicSection()

const { uploadImage } = useUpload()

const heroBannerList = ref<UploadFile[]>([])
const loading = ref(false)
const initialized = ref(false)
const dragIndex = ref<number | null>(null)

// ================= FETCH =================
const fetchBanner = async () => {
  try {
    const res = (await getSection(
      DYNAMIC_SECTION_KEY.HERO_BANNER
    )) as SectionResponse

    const banners = res.data?.content || []

    heroBannerList.value = banners.map(
      (url: string, index: number) => ({
        uid: `${index}`,
        name: `banner-${index}`,
        status: 'done',
        url
      })
    )
  } catch (error) {
    console.error(error)
    message.error('Gagal mengambil hero banner')
  }
}

// ================= VALIDATION =================
const beforeUpload = (file: File) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg'
  ]

  const isImage = allowedTypes.includes(file.type)

  if (!isImage) {
    message.error(
      'File harus berupa JPG, PNG, JPEG, atau WEBP'
    )
    return false
  }

  const isLt2Mb = file.size / 1024 / 1024 < 2

  if (!isLt2Mb) {
    message.error('Ukuran gambar maksimal 2MB')
    return false
  }

  return false
}

// ================= DRAG =================
const onDragStart = (index: number) => {
  dragIndex.value = index
}

const onDrop = (dropIndex: number) => {
  if (dragIndex.value === null) return

  const copied = [...heroBannerList.value]
  const draggedItem = copied[dragIndex.value]

  if (!draggedItem) return

  copied.splice(dragIndex.value, 1)
  copied.splice(dropIndex, 0, draggedItem)

  heroBannerList.value = copied
  dragIndex.value = null
}

// ================= REMOVE =================
const removeImage = (index: number) => {
  heroBannerList.value.splice(index, 1)
}

// ================= SAVE =================
const handleSave = async () => {
  try {
    loading.value = true

    const uploadedImages = await Promise.all(
      heroBannerList.value.map(async file => {
        if (file.url && !file.originFileObj) {
          return file.url
        }

        const imageFile =
          file.originFileObj as File

        const response = (await uploadImage(
          imageFile
        )) as UploadResponse

        return response.data.url
      })
    )

    await updateSection(
      DYNAMIC_SECTION_KEY.HERO_BANNER,
      {
        content: uploadedImages
      }
    )

    message.success(
      'Hero banner berhasil disimpan'
    )
  } catch (error) {
    console.error(error)
    message.error(
      'Gagal menyimpan hero banner'
    )
  } finally {
    loading.value = false
  }
}

// ================= INIT =================
onMounted(async () => {
  await fetchBanner()
  initialized.value = true
})
</script>

<template>
  <a-card
    title="Hero Banner Settings"
    :bordered="false"
    class="shadow-sm rounded-xl"
  >
    <div class="space-y-6">

      <!-- UPLOAD -->
      <div>
        <p class="text-sm text-gray-500 mb-4">
          Upload dan drag gambar untuk mengatur urutan banner
          <span class="italic">
            (recommended size 1456 x 3000)
          </span>
        </p>

        <a-upload
          v-model:file-list="heroBannerList"
          list-type="picture-card"
          :before-upload="beforeUpload"
          multiple
        >
          <div>
            <div class="text-sm">
              Upload
            </div>
          </div>
        </a-upload>
      </div>

      <!-- PREVIEW -->
      <div
        class="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div
          v-for="(item, index) in heroBannerList"
          :key="item.uid"
          draggable="true"
          @dragstart="onDragStart(index)"
          @dragover.prevent
          @drop="onDrop(index)"
          class="relative border rounded-xl overflow-hidden shadow-sm bg-white cursor-move"
        >
          <img
            :src="item.thumbUrl || item.url"
            class="w-full h-40 object-cover"
          >

          <button
            class="absolute top-2 right-2 bg-black/60 text-white w-6 h-6 rounded-full text-xs"
            @click="removeImage(index)"
          >
            ✕
          </button>

          <div
            class="p-2 text-center text-sm text-gray-500"
          >
            Banner {{ index + 1 }}
          </div>
        </div>
      </div>

      <!-- ACTION -->
      <div class="flex justify-end">
        <a-button
          type="primary"
          :loading="loading"
          @click="handleSave"
        >
          Save Settings
        </a-button>
      </div>

    </div>
  </a-card>
</template>