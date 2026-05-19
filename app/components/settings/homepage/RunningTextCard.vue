<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'

type SectionResponse = {
  data?: {
    content?: {
      text?: string
    }
  }
}

const { updateSection, getSection, DYNAMIC_SECTION_KEY } = useDynamicSection()

const runningText = ref('')
const loading = ref(false)
const fetchLoading = ref(false)

const fetchSection = async () => {
  try {
    fetchLoading.value = true

    const res = (await getSection(
      DYNAMIC_SECTION_KEY.RUNNING_TEXT
    )) as SectionResponse

    runningText.value =
      res.data?.content?.text || ''

  } catch (error) {
    console.error(error)
    message.error('Gagal mengambil running text')
  } finally {
    fetchLoading.value = false
  }
}

const handleSave = async () => {
  try {
    loading.value = true

    const res = await updateSection(
      DYNAMIC_SECTION_KEY.RUNNING_TEXT,
      {
        content: {
          text: runningText.value
        }
      }
    ) as { success: boolean }

    message.success('Running text berhasil disimpan')
  } catch (error) {
    message.error('Gagal menyimpan running text')
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
    title="Running Text Settings"
    :bordered="false"
    class="shadow-sm rounded-xl"
    :loading="fetchLoading"
  >
    <div class="space-y-4">
      <a-input
        v-model:value="runningText"
        placeholder="Masukkan running text..."
      />

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