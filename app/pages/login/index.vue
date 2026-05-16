<template>
  <div
    class="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative"
    style="background-image: url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr');"
  >
    <div class="w-full max-w-md relative z-10">

      <a-card class="shadow-2xl rounded-3xl border-0 bg-white/90 backdrop-blur p-6">
        
        <!-- Logo + Title -->
        <div class="flex flex-col items-center mb-6">
          <div class="rounded-xl p-2 mb-3">
            <img
              src="/img/tus.PNG"
              alt="Logo"
              class="h-12 object-contain"
            />
          </div>

        </div>

        <!-- Form -->
        <a-form
          :model="form"
          layout="vertical"
          @finish="onSubmit"
        >
          <!-- Email -->
          <a-form-item
            label="Email"
            name="email"
            :rules="[{ required: true, type: 'email', message: 'Email wajib diisi' }]"
          >
            <a-input
              v-model:value="form.email"
              size="large"
              placeholder="Masukkan email"
              class="rounded-lg focus:!border-blue-500 hover:!border-blue-400 transition"
            />
          </a-form-item>

          <!-- Password -->
          <a-form-item
            label="Password"
            name="password"
            :rules="[{ required: true, message: 'Password wajib diisi' }]"
          >
            <a-input-password
              v-model:value="form.password"
              size="large"
              placeholder="Masukkan password"
              class="rounded-lg focus:!border-blue-500 hover:!border-blue-400 transition"
            />
          </a-form-item>

          <!-- Button -->
          <a-form-item class="mb-3">
            <a-button
              type="primary"
              html-type="submit"
              block
              size="large"
              :loading="loading"
              class="rounded-lg font-medium h-11 transition-all hover:scale-[1.01]"
            >
              Login
            </a-button>
          </a-form-item>

          <!-- Extra -->
          <div class="flex justify-between items-center text-sm">
            <label class="flex items-center gap-2 text-gray-500 cursor-pointer">
              <input type="checkbox" class="rounded" />
              Remember me
            </label>

            <a class="text-blue-500 hover:underline cursor-pointer">
              Lupa password?
            </a>
          </div>
        </a-form>
      </a-card>

      <!-- Footer -->
      <p class="text-center text-xs text-black mt-6 tracking-wide">
        © 2026 The Underwear Supply
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import axios from 'axios'
import { message } from 'ant-design-vue'

interface LoginForm {
  email: string
  password: string
}

const config = useRuntimeConfig()

definePageMeta({
  layout: 'auth'
})

const form = reactive<LoginForm>({
  email: '',
  password: '',
})

const loading = ref(false)

const onSubmit = async () => {
  loading.value = true
    try {
       const res = await axios.post(
        `${config.public.apiBase}/api/v1/private/auth/login`,
        form
        )

        const tokenData = res.data?.data.token

        const accessToken = tokenData?.accessToken
        const refreshToken = tokenData?.refreshToken


        if (accessToken && refreshToken) {
        localStorage.setItem('access_token', accessToken)
        localStorage.setItem('refresh_token', refreshToken)

        message.success('Login berhasil!')
        navigateTo('/products')
        } else {
        message.error('Token tidak ditemukan')
        }
  } catch (err: any) {
    message.error(err?.response?.data?.message || 'Login gagal')
  } finally {
    loading.value = false
  }
}
</script>