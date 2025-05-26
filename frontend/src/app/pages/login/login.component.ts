import { Component } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { MatSnackBar } from "@angular/material/snack-bar"
import { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  loginForm: FormGroup
  loading = false
  hidePassword = true

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    })
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.snackBar.open("¡Bienvenido de vuelta!", "Cerrar", {
            duration: 3000,
          })
          this.router.navigate(["/"])
        },
        error: (error) => {
          this.loading = false
          this.snackBar.open(error.error.message || "Error al iniciar sesión", "Cerrar", { duration: 3000 })
        },
      })
    }
  }

  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field)

    if (control?.hasError("required")) {
      return `${field === "email" ? "Email" : "Contraseña"} es requerido`
    }

    if (control?.hasError("email")) {
      return "Email no válido"
    }

    if (control?.hasError("minlength")) {
      return "La contraseña debe tener al menos 6 caracteres"
    }

    return ""
  }
}
