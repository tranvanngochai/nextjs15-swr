import { setAccessToken, clearTokens } from "./token-management"

export function useAuth() {
  const login = async (credentials: { username: string; password: string }) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Login failed")
      }

      const { accessToken, refreshToken, user } = await response.json()

      // Lưu token
      setAccessToken(accessToken)
      localStorage.setItem("refreshToken", refreshToken)

      return user
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    clearTokens()
    window.location.href = "/login"
  }

  return { login, logout }
}
