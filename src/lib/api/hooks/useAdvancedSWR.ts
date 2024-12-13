/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError } from "@/types/api"
import useSWR from "swr"
import { fetcher } from "../fetcher"

export function useAdvancedSWR<T = any>(
  key: string,
  options?: {
    params?: Record<string, any>
    initialData?: T
    disabled?: boolean
  }
) {
  const { params = {}, initialData, disabled = false } = options || {}

  // Chuyển đổi params thành query string
  const queryString = new URLSearchParams(Object.entries(params)).toString()

  const fullKey = queryString ? `${key}?${queryString}` : key

  const result = useSWR<T, ApiError>(
    disabled ? null : fullKey,
    fetcher as any,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      shouldRetryOnError: (error: any) => {
        // Không retry nếu lỗi do xác thực
        return error.status !== 401 && error.status !== 403
      },
      errorRetryInterval: 5000,
      errorRetryCount: 3,
      fallbackData: initialData,
    }
  )

  return {
    ...result,
    isError: !!result.error,
    errorMessage: result.error?.message,
  }
}
