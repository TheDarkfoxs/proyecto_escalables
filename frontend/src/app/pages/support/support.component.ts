import { Component, OnInit } from "@angular/core"
import { SupportService } from "../../services/support.service"
import { Support, SupportResponse } from "../../models/support.model"
import { MatSnackBar } from "@angular/material/snack-bar"

@Component({
  selector: "app-support",
  templateUrl: "./support.component.html",
  styleUrls: ["./support.component.css"],
})
export class SupportComponent implements OnInit {
  supportItems: Support[] = []
  loading = true
  currentPage = 1
  totalPages = 1
  selectedCategory = ""
  searchTerm = ""
  expandedItems: Set<string> = new Set()

  categories = ["Technical", "Account", "Billing", "Gameplay", "General"]

  constructor(
    private supportService: SupportService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadSupport()
  }

  loadSupport(): void {
    this.loading = true
    const params = {
      page: this.currentPage,
      limit: 10,
      category: this.selectedCategory || undefined,
      search: this.searchTerm || undefined,
    }

    this.supportService.getAllSupport(params).subscribe({
      next: (response: SupportResponse) => {
        this.supportItems = response.supportItems
        this.totalPages = response.totalPages
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading support items:", error)
        this.loading = false
      },
    })
  }

  onFilterChange(): void {
    this.currentPage = 1
    this.loadSupport()
  }

  onPageChange(page: number): void {
    this.currentPage = page
    this.loadSupport()
  }

  toggleExpanded(itemId: string): void {
    if (this.expandedItems.has(itemId)) {
      this.expandedItems.delete(itemId)
    } else {
      this.expandedItems.add(itemId)
    }
  }

  isExpanded(itemId: string): boolean {
    return this.expandedItems.has(itemId)
  }

  markHelpful(itemId: string): void {
    this.supportService.markHelpful(itemId).subscribe({
      next: (response) => {
        this.snackBar.open("¡Gracias por tu feedback!", "Cerrar", { duration: 3000 })
        this.loadSupport()
      },
      error: (error) => {
        this.snackBar.open("Error al marcar como útil", "Cerrar", { duration: 3000 })
      },
    })
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      Technical: "build",
      Account: "account_circle",
      Billing: "payment",
      Gameplay: "sports_esports",
      General: "help",
    }
    return icons[category] || "help"
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      Technical: "#f44336",
      Account: "#2196f3",
      Billing: "#ff9800",
      Gameplay: "#4caf50",
      General: "#9c27b0",
    }
    return colors[category] || "#666"
  }
}
