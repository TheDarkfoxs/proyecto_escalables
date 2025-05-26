import { Component, OnInit } from "@angular/core"
import { GameService } from "../../services/game.service"
import { MerchandiseService } from "../../services/merchandise.service"
import { PostService } from "../../services/post.service"
import { Game } from "../../models/game.model"
import { Merchandise } from "../../models/merchandise.model"
import { Post } from "../../models/post.model"
import { environment } from "../../../environments/environment"

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  featuredGames: Game[] = []
  featuredMerchandise: Merchandise[] = []
  latestPosts: Post[] = []
  loading = true

  constructor(
    private gameService: GameService,
    private merchandiseService: MerchandiseService,
    private postService: PostService,
  ) {}

  ngOnInit(): void {
    this.loadFeaturedContent()
  }

  loadFeaturedContent(): void {
    // Load featured games
    this.gameService.getFeaturedGames().subscribe({
      next: (games) => {
        this.featuredGames = games.slice(0, 3)
      },
      error: (error) => console.error("Error loading featured games:", error),
    })

    // Load featured merchandise
    this.merchandiseService.getFeaturedMerchandise().subscribe({
      next: (merchandise) => {
        this.featuredMerchandise = merchandise.slice(0, 3)
      },
      error: (error) => console.error("Error loading featured merchandise:", error),
    })

    // Load latest posts
    this.postService.getAllPosts({ limit: 3 }).subscribe({
      next: (response) => {
        this.latestPosts = response.posts
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading latest posts:", error)
        this.loading = false
      },
    })
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return "/assets/images/placeholder.jpg"
    if (imagePath.startsWith("http")) {
      return imagePath
    }
    return `${environment.apiUrl.replace("/api", "")}${imagePath}`
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement
    if (target) {
      target.src = "/assets/images/merchandise-placeholder.jpg"
    }
  }
}
