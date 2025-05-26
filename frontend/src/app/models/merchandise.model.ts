export interface Merchandise {
  _id?: string
  name: string
  description: string
  price: number
  category: string
  images: string[]
  sizes: string[]
  colors: string[]
  stock: number
  isActive?: boolean
  featured?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface MerchandiseResponse {
  merchandise: Merchandise[]
  totalPages: number
  currentPage: number
  total: number
}
