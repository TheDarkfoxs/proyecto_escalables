import { Component, Input } from "@angular/core"
import { Game } from "../../models/game.model"
import { AuthService } from "../../services/auth.service"
import { UserService } from "../../services/user.service"
import { MatSnackBar } from "@angular/material/snack-bar"

@Component({
  selector: "app-game-card",
  templateUrl: "./game-card.component.html",
  styleUrls: ["./game-card.component.css"],
})
export class GameCardComponent {
  @Input() game!: Game

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {}

  purchaseGame(): void {
    if (!this.authService.isAuthenticated()) {
      this.snackBar.open("Debes iniciar sesión para comprar juegos", "Cerrar", {
        duration: 3000,
      })
      return
    }

    if (this.game._id) {
      this.userService.purchaseGame(this.game._id).subscribe({
        next: (response) => {
          this.snackBar.open("¡Juego comprado exitosamente!", "Cerrar", {
            duration: 3000,
          })
        },
        error: (error) => {
          this.snackBar.open(error.error.message || "Error al comprar el juego", "Cerrar", {
            duration: 3000,
          })
        },
      })
    }
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated()
  }
}
