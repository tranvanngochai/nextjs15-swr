/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server"
import { fetcher } from "@/lib/api/fetcher"

export async function GET(request: NextRequest) {
  try {
    // Fetch trực tiếp từ API backend
    const response = await fetcher("/api/users")

    return NextResponse.json(response.data, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: "Không thể tải danh sách người dùng" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const response = await fetcher("/api/users", {
      method: "POST",
      body: JSON.stringify(body),
    })

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 }
    )
  }
}
