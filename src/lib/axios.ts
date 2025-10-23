import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

// extend axios config biar ada _retry
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean
  }
}

let accessToken: string | undefined
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token))
  refreshSubscribers = []
}

function addRefreshSubscriber(cb: (token: string) => void) {
  refreshSubscribers.push(cb)
}

const axiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true
})

axiosInstance.interceptors.request.use((config) => {
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig

    if (error.response?.status === 401 && !originalRequest?._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            if (originalRequest?.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            resolve(axiosInstance(originalRequest!))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axiosInstance.post('/auth/refresh')
        accessToken = data.accessToken

        isRefreshing = false
        if (accessToken) {
          onRefreshed(accessToken)
        }

        if (originalRequest?.headers && accessToken) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }
        return axiosInstance(originalRequest!)
      } catch (err) {
        isRefreshing = false
        accessToken = undefined
        window.location.href = '/login'
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)

export function setAccessToken(token: string | null) {
  accessToken = token ?? undefined
}

export default axiosInstance
