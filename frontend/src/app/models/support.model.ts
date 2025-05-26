export interface Support {
  _id?: string
  question: string
  answer: string
  category: string
  isActive?: boolean
  helpfulCount: number
  createdBy: {
    _id: string
    username: string
  }
  createdAt?: Date
  updatedAt?: Date
}

export interface SupportResponse {
  supportItems: Support[]
  totalPages: number
  currentPage: number
  total: number
}
