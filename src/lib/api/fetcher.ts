/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApiError, ApiResponse } from "@/types/api"
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from "../auth/token-management"

async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      throw new Error("No refresh token")
    }

    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to refresh token")
    }

    const { accessToken, refreshToken: newRefreshToken } = await response.json()

    // Lưu token mới
    setAccessToken(accessToken)
    if (newRefreshToken) {
      // Nếu server trả về refresh token mới
      localStorage.setItem("refreshToken", newRefreshToken)
    }

    return accessToken
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: any) {
    // Logout nếu refresh token thất bại
    clearTokens()
    window.location.href = "/login"
    return null
  }
}

export const fetcher = async <T>(
  url: string,
  options?: RequestInit & {
    skipRetry?: boolean
    baseUrl?: string
  }
): Promise<ApiResponse<T>> => {
  const {
    skipRetry = false,
    baseUrl = process.env.NEXT_PUBLIC_API_URL || "",
    ...fetchOptions
  } = options || {}

  const token = getAccessToken()
  const fullUrl = baseUrl + url

  try {
    const response = await fetch(fullUrl, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...fetchOptions?.headers,
      },
      ...fetchOptions,
    })

    // Xử lý token expired
    if (response.status === 401 && !skipRetry) {
      const newToken = await refreshAccessToken()
      if (newToken) {
        // Thử lại request với token mới
        return fetcher(url, {
          ...fetchOptions,
          skipRetry: true,
          headers: {
            ...fetchOptions?.headers,
            Authorization: `Bearer ${newToken}`,
          },
        })
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const error: ApiError = {
        message: errorData.message || "An error occurred",
        status: response.status,
        code: errorData.code,
      }
      throw error
    }

    return await response.json()
  } catch (error) {
    const apiError: ApiError = {
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
      status: (error as any)?.status,
      code: (error as any)?.code,
    }
    throw apiError
  }
}

export const tokenManagement = {
  getToken: getAccessToken,
  setToken: setAccessToken,
  refreshToken: refreshAccessToken,
  clearTokens,
}
