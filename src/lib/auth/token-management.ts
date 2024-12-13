export function getAccessToken(): string | null {
  return localStorage.getItem("accessToken")
}

export function setAccessToken(token: string): void {
  localStorage.setItem("accessToken", token)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem("refreshToken")
}

export function clearTokens(): void {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
}
