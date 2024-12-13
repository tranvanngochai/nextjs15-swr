/* eslint-disable @typescript-eslint/no-explicit-any */
// app/users/CreateUserForm.tsx
"use client"

import { useState } from "react"
import { useAdvancedMutation } from "@/lib/api/hooks/useAdvancedMutation"

export default function CreateUserForm() {
  const [username, setUsername] = useState("")
  const { mutate, isLoading, error } = useAdvancedMutation("/api/users", "POST")

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const result = await mutate({ username })
      // Xử lý kết quả
      console.log(result)
    } catch (err: any) {
      // Xử lý lỗi
      console.log(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create User"}
      </button>
      {error && <div>Error: {error.message}</div>}
    </form>
  )
}
