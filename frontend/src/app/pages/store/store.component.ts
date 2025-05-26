import { Component, OnInit } from "@angular/core"
import { MerchandiseService } from "../../services/merchandise.service"
import { UserService } from "../../services/user.service"
import { AuthService } from "../../services/auth.service"
import { Merchandise, MerchandiseResponse } from "../../models/merchandise.model"
import { MatSnackBar } from "@angular/material/snack-bar"
import { environment } from "../../../environments/environment"

@Component({
  selector: "app-store",
  templateUrl: "./store.component.html",
  styleUrls: ["./store.component.css"],
})
export class StoreComponent implements OnInit {
  merchandise: Merchandise[] = []
  loading = true
  currentPage = 1
  totalPages = 1
  searchTerm = ""
  selectedCategory = ""

  categories = ["Clothing", "Accessories", "Collectibles", "Gaming Gear", "Art"]

  constructor(
    private merchandiseService: MerchandiseService,
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadMerchandise()
  }

  loadMerchandise(): void {
    this.loading = true
    const params = {
      page: this.currentPage,
      limit: 12,
      search: this.searchTerm || undefined,
      category: this.selectedCategory || undefined,
    }

    this.merchandiseService.getAllMerchandise(params).subscribe({
      next: (response: MerchandiseResponse) => {
        this.merchandise = response.merchandise
        this.totalPages = response.totalPages
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading merchandise:", error)
        this.loading = false
      },
    })
  }

  onSearch(): void {
    this.currentPage = 1
    this.loadMerchandise()
  }

  onFilterChange(): void {
    this.currentPage = 1
    this.loadMerchandise()
  }

  onPageChange(page: number): void {
    this.currentPage = page
    this.loadMerchandise()
  }

  purchaseMerchandise(merchandiseId: string): void {
    if (!this.authService.isAuthenticated()) {
      this.snackBar.open("Debes iniciar sesión para comprar", "Cerrar", {
        duration: 3000,
      })
      return
    }

    this.userService.purchaseMerchandise(merchandiseId).subscribe({
      next: (response) => {
        this.snackBar.open("¡Producto comprado exitosamente!", "Cerrar", {
          duration: 3000,
        })
        this.loadMerchandise()
      },
      error: (error) => {
        this.snackBar.open(error.error.message || "Error al comprar el producto", "Cerrar", {
          duration: 3000,
        })
      },
    })
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return "/assets/images/merchandise-placeholder.jpg"
    if (imagePath.startsWith("http")) {
      return imagePath
    }
    return `${environment.apiUrl.replace("/api", "")}${imagePath}`
  }

  clearFilters(): void {
    this.searchTerm = ""
    this.selectedCategory = ""
    this.currentPage = 1
    this.loadMerchandise()
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated()
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement
    if (target) {
      target.src = "/assets/images/merchandise-placeholder.jpg"
    }
  }
}
