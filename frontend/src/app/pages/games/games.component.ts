import { Component, type OnInit } from "@angular/core"
import { GameService } from "../../services/game.service"
import { Game, GameResponse } from "../../models/game.model"

@Component({
  selector: "app-games",
  templateUrl: "./games.component.html",
  styleUrls: ["./games.component.css"],
})
export class GamesComponent implements OnInit {
  games: Game[] = []
  loading = true
  currentPage = 1
  totalPages = 1
  searchTerm = ""
  selectedGenre = ""
  selectedPlatform = ""

  genres = ["Action", "Adventure", "RPG", "Strategy", "Simulation", "Sports", "Racing", "Puzzle", "Horror", "Indie"]
  platforms = ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"]

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.loadGames()
  }

  loadGames(): void {
    this.loading = true
    const params = {
      page: this.currentPage,
      limit: 12,
      search: this.searchTerm || undefined,
      genre: this.selectedGenre || undefined,
      platform: this.selectedPlatform || undefined,
    }

    this.gameService.getAllGames(params).subscribe({
      next: (response: GameResponse) => {
        this.games = response.games
        this.totalPages = response.totalPages
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading games:", error)
        this.loading = false
      },
    })
  }

  onSearch(): void {
    this.currentPage = 1
    this.loadGames()
  }

  onFilterChange(): void {
    this.currentPage = 1
    this.loadGames()
  }

  onPageChange(page: number): void {
    this.currentPage = page
    this.loadGames()
  }

  clearFilters(): void {
    this.searchTerm = ""
    this.selectedGenre = ""
    this.selectedPlatform = ""
    this.currentPage = 1
    this.loadGames()
  }
}
