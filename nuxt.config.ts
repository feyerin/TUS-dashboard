// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: {
    enabled: true
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@ant-design-vue/nuxt',
    '@sidebase/nuxt-auth'
  ],

  runtimeConfig: {
    public: {
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE
    }
  },

  css: [
    '~/assets/css/main.css',
    'ant-design-vue/dist/reset.css'
  ],

  auth: {
    provider: {
      type: 'local',

      endpoints: {
        signIn: {
          path: '/auth/login',
          method: 'post'
        },

        signOut: {
          path: '/auth/logout',
          method: 'post'
        },

        getSession: {
          path: '/auth/me',
          method: 'get'
        }
      },

      token: {
        signInResponseTokenPointer:
          '/accessToken'
      }
    }
  }
})