export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: {
    id: string
    email: string
    role: 'ADMIN' | 'AUDITOR'
  }
}

export interface LogoutResponse {
  ok: boolean
}
