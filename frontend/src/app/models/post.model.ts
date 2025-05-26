export interface Post {
  _id?: string
  title: string
  content: string
  author: {
    _id: string
    username: string
    firstName: string
    lastName: string
    avatar?: string
  }
  category: string
  tags: string[]
  image?: string
  likes: string[]
  comments: Comment[]
  isPublished?: boolean
  featured?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface Comment {
  _id?: string
  user: {
    _id: string
    username: string
    avatar?: string
  }
  content: string
  createdAt: Date
}

export interface PostResponse {
  posts: Post[]
  totalPages: number
  currentPage: number
  total: number
}
