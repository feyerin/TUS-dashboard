import type { Auth } from '#auth'

declare module '#app' {
  interface NuxtApp {
    $auth: Auth
  }
}