import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { GameService } from "../../services/game.service"
import { PostService } from "../../services/post.service"
import { SupportService } from "../../services/support.service"
import { MerchandiseService } from "../../services/merchandise.service"
import { UserService } from "../../services/user.service"
import { MatSnackBar } from "@angular/material/snack-bar"
import { environment } from "../../../environments/environment"

interface ImagePreview {
  file: File
  preview: string
}

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"],
})
export class AdminComponent implements OnInit {
  activeTab = 0
  loading = false

  // Forms
  gameForm!: FormGroup
  postForm!: FormGroup
  supportForm!: FormGroup
  merchandiseForm!: FormGroup

  // Image handling
  selectedGameImages: ImagePreview[] = []
  selectedMerchandiseImages: ImagePreview[] = []

  // Data
  games: any[] = []
  posts: any[] = []
  supportItems: any[] = []
  merchandise: any[] = []
  users: any[] = []

  // Options
  gameGenres = ["Action", "Adventure", "RPG", "Strategy", "Simulation", "Sports", "Racing", "Puzzle", "Horror", "Indie"]
  gamePlatforms = ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"]
  gameRatings = ["E", "E10+", "T", "M", "AO"]
  postCategories = ["News", "Updates", "Community", "Events", "Guides"]
  supportCategories = ["Technical", "Account", "Billing", "Gameplay", "General"]
  merchandiseCategories = ["Clothing", "Accessories", "Collectibles", "Gaming Gear", "Art"]

  constructor(
    private fb: FormBuilder,
    private gameService: GameService,
    private postService: PostService,
    private supportService: SupportService,
    private merchandiseService: MerchandiseService,
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {
    this.initializeForms()
  }

  ngOnInit(): void {
    this.loadAllData()
  }

  initializeForms(): void {
    this.gameForm = this.fb.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      genre: ["", Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      releaseDate: ["", Validators.required],
      platform: [[], Validators.required],
      rating: ["E", Validators.required],
      featured: [false],
    })

    this.postForm = this.fb.group({
      title: ["", Validators.required],
      content: ["", Validators.required],
      category: ["", Validators.required],
      tags: [""],
      featured: [false],
    })

    this.supportForm = this.fb.group({
      question: ["", Validators.required],
      answer: ["", Validators.required],
      category: ["", Validators.required],
    })

    this.merchandiseForm = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ["", Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      sizes: [""],
      colors: [""],
      featured: [false],
    })
  }

  // Image handling methods
  onGameImagesSelected(event: any): void {
    this.handleImageSelection(event.target.files, "game")
  }

  onMerchandiseImagesSelected(event: any): void {
    this.handleImageSelection(event.target.files, "merchandise")
  }

  onGameImagesDrop(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    const files = event.dataTransfer?.files
    if (files) {
      this.handleImageSelection(files, "game")
    }
    this.removeDragOverClass(event.target as HTMLElement)
  }

  onMerchandiseImagesDrop(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    const files = event.dataTransfer?.files
    if (files) {
      this.handleImageSelection(files, "merchandise")
    }
    this.removeDragOverClass(event.target as HTMLElement)
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.addDragOverClass(event.target as HTMLElement)
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.removeDragOverClass(event.target as HTMLElement)
  }

  private addDragOverClass(element: HTMLElement): void {
    element.classList.add("drag-over")
  }

  private removeDragOverClass(element: HTMLElement): void {
    element.classList.remove("drag-over")
  }

  private handleImageSelection(files: FileList, type: "game" | "merchandise"): void {
    const maxFiles = 5
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]

    const currentImages = type === "game" ? this.selectedGameImages : this.selectedMerchandiseImages

    if (currentImages.length + files.length > maxFiles) {
      this.snackBar.open(`Máximo ${maxFiles} imágenes permitidas`, "Cerrar", { duration: 3000 })
      return
    }

    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        this.snackBar.open(`Tipo de archivo no permitido: ${file.name}`, "Cerrar", { duration: 3000 })
        return
      }

      if (file.size > maxSize) {
        this.snackBar.open(`Archivo muy grande: ${file.name}`, "Cerrar", { duration: 3000 })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const imagePreview: ImagePreview = {
          file: file,
          preview: e.target?.result as string,
        }

        if (type === "game") {
          this.selectedGameImages.push(imagePreview)
        } else {
          this.selectedMerchandiseImages.push(imagePreview)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  removeGameImage(index: number): void {
    this.selectedGameImages.splice(index, 1)
  }

  removeMerchandiseImage(index: number): void {
    this.selectedMerchandiseImages.splice(index, 1)
  }

  getImageUrl(imagePath: string): string {
    if (imagePath.startsWith("http")) {
      return imagePath
    }
    return `${environment.apiUrl.replace("/api", "")}${imagePath}`
  }

  loadAllData(): void {
    this.loadGames()
    this.loadPosts()
    this.loadSupport()
    this.loadMerchandise()
    this.loadUsers()
  }

  loadGames(): void {
    this.gameService.getAllGames({ limit: 100 }).subscribe({
      next: (response) => {
        this.games = response.games
      },
      error: (error) => console.error("Error loading games:", error),
    })
  }

  loadPosts(): void {
    this.postService.getAllPosts({ limit: 100 }).subscribe({
      next: (response) => {
        this.posts = response.posts
      },
      error: (error) => console.error("Error loading posts:", error),
    })
  }

  loadSupport(): void {
    this.supportService.getAllSupport({ limit: 100 }).subscribe({
      next: (response) => {
        this.supportItems = response.supportItems
      },
      error: (error) => console.error("Error loading support:", error),
    })
  }

  loadMerchandise(): void {
    this.merchandiseService.getAllMerchandise({ limit: 100 }).subscribe({
      next: (response) => {
        this.merchandise = response.merchandise
      },
      error: (error) => console.error("Error loading merchandise:", error),
    })
  }

  loadUsers(): void {
    this.userService.getAllUsers({ limit: 100 }).subscribe({
      next: (response) => {
        this.users = response.users
      },
      error: (error) => console.error("Error loading users:", error),
    })
  }

  // Create methods
  createGame(): void {
    if (this.gameForm.valid) {
      const gameData = {
        ...this.gameForm.value,
        images: this.selectedGameImages.map((img) => img.file),
      }

      this.gameService.createGame(gameData).subscribe({
        next: (response) => {
          this.snackBar.open("Juego creado exitosamente", "Cerrar", { duration: 3000 })
          this.gameForm.reset()
          this.selectedGameImages = []
          this.loadGames()
        },
        error: (error) => {
          this.snackBar.open("Error al crear el juego", "Cerrar", { duration: 3000 })
        },
      })
    }
  }

  createPost(): void {
    if (this.postForm.valid) {
      const postData = { ...this.postForm.value }
      if (postData.tags) {
        postData.tags = postData.tags.split(",").map((tag: string) => tag.trim())
      }

      this.postService.createPost(postData).subscribe({
        next: (response) => {
          this.snackBar.open("Post creado exitosamente", "Cerrar", { duration: 3000 })
          this.postForm.reset()
          this.loadPosts()
        },
        error: (error) => {
          this.snackBar.open("Error al crear el post", "Cerrar", { duration: 3000 })
        },
      })
    }
  }

  createSupport(): void {
    if (this.supportForm.valid) {
      this.supportService.createSupport(this.supportForm.value).subscribe({
        next: (response) => {
          this.snackBar.open("Artículo de soporte creado exitosamente", "Cerrar", { duration: 3000 })
          this.supportForm.reset()
          this.loadSupport()
        },
        error: (error) => {
          this.snackBar.open("Error al crear el artículo de soporte", "Cerrar", { duration: 3000 })
        },
      })
    }
  }

  createMerchandise(): void {
    if (this.merchandiseForm.valid) {
      const merchandiseData = {
        ...this.merchandiseForm.value,
        images: this.selectedMerchandiseImages.map((img) => img.file),
      }

      this.merchandiseService.createMerchandise(merchandiseData).subscribe({
        next: (response) => {
          this.snackBar.open("Producto creado exitosamente", "Cerrar", { duration: 3000 })
          this.merchandiseForm.reset()
          this.selectedMerchandiseImages = []
          this.loadMerchandise()
        },
        error: (error) => {
          this.snackBar.open("Error al crear el producto", "Cerrar", { duration: 3000 })
        },
      })
    }
  }

  // Delete methods
  deleteGame(id: string): void {
    if (confirm("¿Estás seguro de que quieres eliminar este juego?")) {
      this.gameService.deleteGame(id).subscribe({
        next: () => {
          this.snackBar.open("Juego eliminado exitosamente", "Cerrar", { duration: 3000 })
          this.loadGames()
        },
        error: (error) => {
          this.snackBar.open("Error al eliminar el juego", "Cerrar", { duration: 3000 })
        },
      })
    }
  }

  deletePost(id: string): void {
    if (confirm("¿Estás seguro de que quieres eliminar este post?")) {
      this.postService.deletePost(id).subscribe({
        next: () => {
          this.snackBar.open("Post eliminado exitosamente", "Cerrar", { duration: 3000 })
          this.loadPosts()
        },
        error: (error) => {
          this.snackBar.open("Error al eliminar el post", "Cerrar", { duration: 3000 })
        },
      })
    }
  }

  deleteSupport(id: string): void {
    if (confirm("¿Estás seguro de que quieres eliminar este artículo de soporte?")) {
      this.supportService.deleteSupport(id).subscribe({
        next: () => {
          this.snackBar.open("Artículo eliminado exitosamente", "Cerrar", { duration: 3000 })
          this.loadSupport()
        },
        error: (error) => {
          this.snackBar.open("Error al eliminar el artículo", "Cerrar", { duration: 3000 })
        },
      })
    }
  }

  deleteMerchandise(id: string): void {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      this.merchandiseService.deleteMerchandise(id).subscribe({
        next: () => {
          this.snackBar.open("Producto eliminado exitosamente", "Cerrar", { duration: 3000 })
          this.loadMerchandise()
        },
        error: (error) => {
          this.snackBar.open("Error al eliminar el producto", "Cerrar", { duration: 3000 })
        },
      })
    }
  }

  deleteUser(id: string): void {
    if (confirm("¿Estás seguro de que quieres desactivar este usuario?")) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.snackBar.open("Usuario desactivado exitosamente", "Cerrar", { duration: 3000 })
          this.loadUsers()
        },
        error: (error) => {
          this.snackBar.open("Error al desactivar el usuario", "Cerrar", { duration: 3000 })
        },
      })
    }
  }
}
