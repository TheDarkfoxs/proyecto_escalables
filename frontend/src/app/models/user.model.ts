export interface User {
  _id?: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: "user" | "admin"
  avatar?: string
  isActive?: boolean
  purchasedGames?: PurchasedGame[]
  purchasedMerchandise?: PurchasedMerchandise[]
  createdAt?: Date
  updatedAt?: Date
}

export interface PurchasedGame {
  _id: string
  title: string
  description?: string
  price: number
  genre?: string
  images?: string[]
  platform?: string[]
  rating?: string
}

export interface PurchasedMerchandise {
  _id: string
  name: string
  description?: string
  price: number
  category?: string
  images?: string[]
  stock?: number
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
