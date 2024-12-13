// app/users/UserListAdvanced.tsx
"use client"

import { useAdvancedSWR } from "@/lib/api/hooks/useAdvancedSWR"
interface User {
  id: number
  name: string
  email: string
}

export default function UserListAdvanced() {
  const {
    data: users,
    isLoading,
    error,
    mutate, // Hàm để refresh data
  } = useAdvancedSWR<User[]>("/api/users", {
    // Tắt fetch nếu cần
    disabled: false,
    // Dữ liệu ban đầu (tùy chọn)
    initialData: [],
  })

  // Hàm refresh data thủ công
  const handleRefresh = () => {
    mutate()
  }

  if (isLoading) return <div>Đang tải...</div>
  if (error) return <div>Lỗi: {error.message}</div>

  return (
    <div>
      <h1>Danh sách người dùng</h1>
      <button onClick={handleRefresh}>Làm mới danh sách</button>
      {users && users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} - {user.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có người dùng nào</p>
      )}
    </div>
  )
}
