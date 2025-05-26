export interface User {
  _id?: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: "user" | "admin"
  avatar?: string
  isActive?: boolean
  purchasedGames?: string[]
  purchasedMerchandise?: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface AuthResponse {
  message: string
  token: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
}
