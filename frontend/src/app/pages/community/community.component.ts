import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { PostService } from "../../services/post.service"
import { AuthService } from "../../services/auth.service"
import { Post, PostResponse } from "../../models/post.model"
import { MatSnackBar } from "@angular/material/snack-bar"

@Component({
  selector: "app-community",
  templateUrl: "./community.component.html",
  styleUrls: ["./community.component.css"],
})
export class CommunityComponent implements OnInit {
  posts: Post[] = []
  loading = true
  currentPage = 1
  totalPages = 1
  selectedCategory = ""
  searchTerm = ""
  showCreatePost = false
  createPostForm: FormGroup

  categories = ["News", "Updates", "Community", "Events", "Guides"]

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.createPostForm = this.fb.group({
      title: ["", [Validators.required, Validators.minLength(5)]],
      content: ["", [Validators.required, Validators.minLength(10)]],
      category: ["", Validators.required],
      tags: [""],
    })
  }

  ngOnInit(): void {
    this.loadPosts()
  }

  loadPosts(): void {
    this.loading = true
    const params = {
      page: this.currentPage,
      limit: 10,
      category: this.selectedCategory || undefined,
      search: this.searchTerm || undefined,
    }

    this.postService.getAllPosts(params).subscribe({
      next: (response: PostResponse) => {
        this.posts = response.posts
        this.totalPages = response.totalPages
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading posts:", error)
        this.loading = false
      },
    })
  }

  onFilterChange(): void {
    this.currentPage = 1
    this.loadPosts()
  }

  onPageChange(page: number): void {
    this.currentPage = page
    this.loadPosts()
  }

  createPost(): void {
    if (this.createPostForm.valid) {
      const postData = { ...this.createPostForm.value }
      if (postData.tags) {
        postData.tags = postData.tags.split(",").map((tag: string) => tag.trim())
      }

      this.postService.createPost(postData).subscribe({
        next: (response) => {
          this.snackBar.open("Post creado exitosamente", "Cerrar", { duration: 3000 })
          this.showCreatePost = false
          this.createPostForm.reset()
          this.loadPosts()
        },
        error: (error) => {
          this.snackBar.open("Error al crear el post", "Cerrar", { duration: 3000 })
        },
      })
    }
  }

  likePost(postId: string): void {
    if (!this.isAuthenticated()) {
      this.snackBar.open("Debes iniciar sesión para dar like", "Cerrar", { duration: 3000 })
      return
    }

    this.postService.likePost(postId).subscribe({
      next: (response) => {
        this.loadPosts()
      },
      error: (error) => {
        this.snackBar.open("Error al dar like", "Cerrar", { duration: 3000 })
      },
    })
  }

  addComment(postId: string, content: string): void {
    if (!this.isAuthenticated()) {
      this.snackBar.open("Debes iniciar sesión para comentar", "Cerrar", { duration: 3000 })
      return
    }

    this.postService.addComment(postId, content).subscribe({
      next: (response) => {
        this.loadPosts()
      },
      error: (error) => {
        this.snackBar.open("Error al agregar comentario", "Cerrar", { duration: 3000 })
      },
    })
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated()
  }

  getCurrentUser() {
    return this.authService.getCurrentUser()
  }
}
