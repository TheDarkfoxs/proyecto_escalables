import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { AuthService } from "../../services/auth.service"
import { UserService } from "../../services/user.service"
import { User } from "../../models/user.model"
import { MatSnackBar } from "@angular/material/snack-bar"

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  user: User | null = null
  profileForm: FormGroup
  loading = true
  updating = false
  activeTab = 0

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.profileForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(2)]],
      lastName: ["", [Validators.required, Validators.minLength(2)]],
      username: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.email]],
    })
  }

  ngOnInit(): void {
    this.loadProfile()
  }

  loadProfile(): void {
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.user = user
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
        })
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading profile:", error)
        this.loading = false
      },
    })
  }

  updateProfile(): void {
    if (this.profileForm.valid && this.user) {
      this.updating = true

      this.userService.updateUser(this.user._id!, this.profileForm.value).subscribe({
        next: (response) => {
          this.snackBar.open("Perfil actualizado exitosamente", "Cerrar", {
            duration: 3000,
          })
          this.updating = false
          this.loadProfile()
        },
        error: (error) => {
          this.snackBar.open("Error al actualizar el perfil", "Cerrar", {
            duration: 3000,
          })
          this.updating = false
        },
      })
    }
  }

  getErrorMessage(field: string): string {
    const control = this.profileForm.get(field)

    if (control?.hasError("required")) {
      const fieldNames: { [key: string]: string } = {
        firstName: "Nombre",
        lastName: "Apellido",
        username: "Usuario",
        email: "Email",
      }
      return `${fieldNames[field]} es requerido`
    }

    if (control?.hasError("email")) {
      return "Email no válido"
    }

    if (control?.hasError("minlength")) {
      const minLength = control.errors?.["minlength"].requiredLength
      return `Debe tener al menos ${minLength} caracteres`
    }

    return ""
  }

  formatDate(date: Date | undefined): string {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
}
