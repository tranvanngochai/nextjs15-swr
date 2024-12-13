/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { ApiError } from "@/types/api"
import { fetcher } from "../fetcher"

export function useAdvancedMutation<T = any, R = any>(
  url: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE"
) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const mutate = async (data: T) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await fetcher<R>(url, {
        method,
        body: JSON.stringify(data),
      })
      return result
    } catch (err) {
      setError(err as ApiError)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    mutate,
    isLoading,
    error,
  }
}
