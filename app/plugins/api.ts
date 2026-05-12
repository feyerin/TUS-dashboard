// plugins/api.ts

export default defineNuxtPlugin(() => {
  const config =
    useRuntimeConfig()

  const router = useRouter()

  const baseFetch =
    $fetch.create({
      baseURL:
        config.public.apiBase
    })

  let refreshPromise:
    | Promise<
        string | void
      >
    | null = null

  const refreshAccessToken =
    async () => {
      try {
        const refreshToken =
          localStorage.getItem(
            'refresh_token'
          )

        if (!refreshToken) {
          localStorage.removeItem(
            'access_token'
          )

          await router.push(
            '/login'
          )

          return
        }

        const res: any =
          await $fetch(
            `${config.public.apiBase}/api/v1/private/auth/refresh-token`,
            {
              method: 'POST',
              body: {
                refreshToken
              }
            }
          )

        const accessToken =
          res.data.token
            .accessToken

        localStorage.setItem(
          'access_token',
          accessToken
        )

        localStorage.setItem(
          'refresh_token',
          res.data.token
            .refreshToken
        )

        return accessToken
      } catch (error) {
        localStorage.removeItem(
          'access_token'
        )

        localStorage.removeItem(
          'refresh_token'
        )

        await router.push(
          '/login'
        )
      }
    }

  const api = async <T>(
    url: string,
    options: any = {},
    isRetry = false
  ): Promise<T> => {
    try {
      const token =
        localStorage.getItem(
          'access_token'
        )

      return await baseFetch<T>(
        url,
        {
          ...options,
          headers: {
            ...options.headers,
            ...(token
              ? {
                  Authorization: `Bearer ${token}`
                }
              : {})
          }
        }
      )
    } catch (err: any) {
      const status =
        err?.status ||
        err?.response
          ?.status

      if (
        status === 401 &&
        !isRetry
      ) {
        if (!refreshPromise) {
          refreshPromise =
            refreshAccessToken().finally(
              () => {
                refreshPromise =
                  null
              }
            )
        }

        const newToken =
          await refreshPromise

        if (newToken) {
          return await api<T>(
            url,
            options,
            true
          )
        }
      }

      throw err
    }
  }

  return {
    provide: {
      api
    }
  }
})