<script setup lang="ts">
import {
  ref,
  watch,
  onMounted
} from 'vue'

import { message } from 'ant-design-vue'

import type { UploadFile } from 'ant-design-vue'

type UploadResponse = {
  data: {
    url: string
  }
}

type SectionResponse = {
  data?: {
    content?: {
      image?: string
      subtitle?: string
      title?: string
      buttonText?: string
      buttonLink?: string
    }
  }
}

const {
  updateSection,
  getSection,
  DYNAMIC_SECTION_KEY
} = useDynamicSection()

const { uploadImage } = useUpload()

const loading = ref(false)

const fileList = ref<
  UploadFile[]
>([])

const form = ref({
  file: undefined as
    | UploadFile
    | undefined,

  subtitle: '',

  title: '',

  buttonText: '',

  buttonLink: ''
})

watch(fileList, files => {
  form.value.file = files[0]
})

const fetchSection = async () => {
  try {
    const res =
      (await getSection(
        DYNAMIC_SECTION_KEY.COLLECTION_SECTION_2
      )) as SectionResponse

    const content =
      res.data?.content

    if (!content) return

    form.value.subtitle =
      content.subtitle || ''

    form.value.title =
      content.title || ''

    form.value.buttonText =
      content.buttonText || ''

    form.value.buttonLink =
      content.buttonLink || ''

    if (content.image) {
      fileList.value = [
        {
          uid: '1',
          name: 'collection-image',
          status: 'done',
          url: content.image
        }
      ]
    }
  } catch (error) {
    console.error(error)

    message.error(
      'Gagal mengambil data collection section'
    )
  }
}

const beforeUpload = (
  file: File
) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg'
  ]

  const isImage =
    allowedTypes.includes(
      file.type
    )

  if (!isImage) {
    message.error(
      'File harus berupa JPG, PNG, JPEG, atau WEBP'
    )

    return false
  }

  const isLt2Mb =
    file.size / 1024 / 1024 < 2

  if (!isLt2Mb) {
    message.error(
      'Ukuran gambar maksimal 2MB'
    )

    return false
  }

  return false
}

const handleSave = async () => {
  try {
    loading.value = true

    let imageUrl = ''

    if (
      form.value.file?.url &&
      !form.value.file
        ?.originFileObj
    ) {
      imageUrl =
        form.value.file.url
    }

    if (
      form.value.file
        ?.originFileObj
    ) {
      const response =
        (await uploadImage(
          form.value.file
            .originFileObj as File
        )) as UploadResponse

      imageUrl =
        response.data.url
    }

    const res =
      (await updateSection(
        DYNAMIC_SECTION_KEY.COLLECTION_SECTION,
        {
          content: {
            image: imageUrl,

            subtitle:
              form.value
                .subtitle,

            title:
              form.value.title,

            buttonText:
              form.value
                .buttonText,

            buttonLink:
              form.value
                .buttonLink
          }
        }
      )) as {
        success: boolean
      }

    if (res.success) {
      message.success(
        'Collection section berhasil disimpan'
      )
    } else {
      message.error(
        'Gagal menyimpan collection section'
      )
    }
  } catch (error) {
    console.error(error)

    message.error(
      'Terjadi kesalahan'
    )
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSection()
})
</script>

<template>
  <a-card
    title="Second Collection Section"
    :bordered="false"
    class="shadow-sm rounded-xl"
  >
    <div class="space-y-4">
      <div>
        <p class="text-sm text-gray-500 mb-2">
          Upload gambar collection
        </p>

        <a-upload
          v-model:file-list="
            fileList
          "
          list-type="picture-card"
          :max-count="1"
          :before-upload="
            beforeUpload
          "
        >
          <div>
            Upload
          </div>
        </a-upload>
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <a-input
          v-model:value="
            form.subtitle
          "
          placeholder="Subtitle"
        />

        <a-input
          v-model:value="
            form.title
          "
          placeholder="Title"
        />

        <a-input
          v-model:value="
            form.buttonText
          "
          placeholder="Button Text"
        />

        <a-input
          v-model:value="
            form.buttonLink
          "
          placeholder="Button Link"
        />
      </div>

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