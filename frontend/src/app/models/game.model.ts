export interface Game {
  _id?: string
  title: string
  description: string
  genre: string
  price: number
  releaseDate: Date
  developer: string
  platform: string[]
  rating: string
  images: string[]
  trailer?: string
  systemRequirements?: {
    minimum: SystemRequirement
    recommended: SystemRequirement
  }
  isActive?: boolean
  featured?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface SystemRequirement {
  os: string
  processor: string
  memory: string
  graphics: string
  storage: string
}

export interface GameResponse {
  games: Game[]
  totalPages: number
  currentPage: number
  total: number
}
