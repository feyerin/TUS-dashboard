<script setup lang="ts">
import { message } from 'ant-design-vue'
import type {ApiResponse, SocialMediaPayload, ContactPayload } from '~/type/contact'

useHead({
  title: 'General Settings • Dashboard'
})

const {
  getContact,
  updateContact,

  getSocialMedia,
  updateSocialMedia
} = useSetting()

// ================= STATE =================
const loadingContact = ref(false)
const loadingSocial = ref(false)

// ================= FORM =================
const contactForm = ref<ContactPayload>({
  email: '',
  hours: '',
  phone_number: '',
  store: ''
})

const socialForm = ref<SocialMediaPayload>({
  instagram: '',
  facebook: '',
  tiktok: ''
})

// ================= FETCH CONTACT =================
const fetchContact = async () => {
  try {
    loadingContact.value = true

    const response = await getContact()

    contactForm.value = response
  }
  catch (error) {
    message.error('Failed to fetch contact settings')
  }
  finally {
    loadingContact.value = false
  }
}

// ================= FETCH SOCIAL =================
const fetchSocialMedia = async () => {
  try {
    loadingSocial.value = true

    const response = await getSocialMedia()

    socialForm.value = response
  }
  catch (error) {
    message.error('Failed to fetch social media settings')
  }
  finally {
    loadingSocial.value = false
  }
}

// ================= SAVE CONTACT =================
const saveContact = async () => {
  try {
    loadingContact.value = true

    await updateContact(contactForm.value)

    message.success('Contact settings saved!')
  }
  catch (error) {
    message.error('Failed to save contact settings')
  }
  finally {
    loadingContact.value = false
  }
}

// ================= SAVE SOCIAL =================
const saveSocialMedia = async () => {
  try {
    loadingSocial.value = true

    await updateSocialMedia(socialForm.value)

    message.success('Social media settings saved!')
  }
  catch (error) {
    message.error('Failed to save social media settings')
  }
  finally {
    loadingSocial.value = false
  }
}

// ================= INIT =================
onMounted(() => {
  fetchContact()
  fetchSocialMedia()
})
</script>

<template>
  <client-only>
    <div class="max-w-7xl mx-auto space-y-6">

      <!-- ================= CONTACT ================= -->
      <a-card
        title="Contact Information"
        :bordered="false"
        class="shadow-sm"
        :loading="loadingContact"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <a-input
            v-model:value="contactForm.email"
            placeholder="Email"
          />

          <a-input
            v-model:value="contactForm.phone_number"
            placeholder="Phone Number"
          />

          <a-textarea
            v-model:value="contactForm.store"
            placeholder="Store / Address"
            :rows="3"
            class="md:col-span-2"
          />

          <a-input
            v-model:value="contactForm.hours"
            placeholder="Office Hours, contoh (07:00 WIB - 19:00 WIB)"
            class="md:col-span-2"
          />

        </div>

        <div class="flex justify-end mt-6">
          <a-button
            type="primary"
            :loading="loadingContact"
            @click="saveContact"
          >
            Save Contact
          </a-button>
        </div>
      </a-card>

      <!-- ================= SOCIAL MEDIA ================= -->
      <a-card
        title="Social Media"
        :bordered="false"
        class="shadow-sm"
        :loading="loadingSocial"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <a-input
            v-model:value="socialForm.instagram"
            placeholder="Instagram URL"
          />

          <a-input
            v-model:value="socialForm.facebook"
            placeholder="Facebook URL"
          />

          <a-input
            v-model:value="socialForm.tiktok"
            placeholder="TikTok URL"
          />

        </div>

        <div class="flex justify-end mt-6">
          <a-button
            type="primary"
            :loading="loadingSocial"
            @click="saveSocialMedia"
          >
            Save Social Media
          </a-button>
        </div>
      </a-card>

    </div>
  </client-only>
</template>