<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'

useHead({
  title: 'General Settings • Dashboard'
})

// ================= TYPES =================
interface GeneralSettings {
  email: string
  phone: string
  address: string
  officeHours: string
  instagram: string
  facebook: string
  tiktok: string
}

// ================= STATE =================
const form = ref<GeneralSettings>({
  email: '',
  phone: '',
  address: '',
  officeHours: '',
  instagram: '',
  facebook: '',
  tiktok: '',
})

// ================= SAVE =================
const handleSave = () => {
  message.success('General settings saved!')
}
</script>

<template>
  <client-only>
    <div class="max-w-7xl mx-auto space-y-6">

      <!-- ================= CONTACT INFO ================= -->
      <a-card title="Contact Information" :bordered="false" class="shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <a-input
            v-model:value="form.email"
            placeholder="Email"
          />

          <a-input
            v-model:value="form.phone"
            placeholder="Phone Number"
          />

          <a-textarea
            v-model:value="form.address"
            placeholder="Address"
            :rows="3"
            class="md:col-span-2"
          />

          <a-input
            v-model:value="form.officeHours"
            placeholder="Office Hours (e.g. Mon - Fri, 09:00 - 18:00)"
            class="md:col-span-2"
          />

        </div>
      </a-card>

      <!-- ================= SOCIAL MEDIA ================= -->
      <a-card title="Social Media" :bordered="false" class="shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <a-input
            v-model:value="form.instagram"
            placeholder="Instagram URL"
          />

          <a-input
            v-model:value="form.facebook"
            placeholder="Facebook URL"
          />

          <a-input
            v-model:value="form.tiktok"
            placeholder="TikTok URL"
          />

        </div>
      </a-card>

      <!-- ================= SAVE ================= -->
      <div class="flex justify-end">
        <a-button type="primary" size="large" @click="handleSave">
          Save Settings
        </a-button>
      </div>

    </div>
  </client-only>
</template>