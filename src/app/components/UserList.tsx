/* eslint-disable @typescript-eslint/no-explicit-any */
// app/users/UserList.tsx
"use client"

import { useState, useEffect } from "react"
import { fetcher } from "@/lib/api/fetcher"

export default function UserList() {
  const [users, setUsers] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetcher("/api/users")
        setUsers(response.data)
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error loading users</div>

  return (
    <div>
      {users.map((user: any) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}
