import { Component } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { MatSnackBar } from "@angular/material/snack-bar"
import { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent {
  registerForm: FormGroup
  loading = false
  hidePassword = true
  hideConfirmPassword = true

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ["", [Validators.required, Validators.minLength(2)]],
        lastName: ["", [Validators.required, Validators.minLength(2)]],
        username: ["", [Validators.required, Validators.minLength(3)]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    )
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get("password")
    const confirmPassword = form.get("confirmPassword")

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true })
    } else {
      if (confirmPassword?.hasError("passwordMismatch")) {
        confirmPassword.setErrors(null)
      }
    }

    return null
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true

      const { confirmPassword, ...userData } = this.registerForm.value

      this.authService.register(userData).subscribe({
        next: (response) => {
          this.snackBar.open("¡Cuenta creada exitosamente!", "Cerrar", {
            duration: 3000,
          })
          this.router.navigate(["/"])
        },
        error: (error) => {
          this.loading = false
          this.snackBar.open(error.error.message || "Error al crear la cuenta", "Cerrar", { duration: 3000 })
        },
      })
    }
  }

  getErrorMessage(field: string): string {
    const control = this.registerForm.get(field)

    if (control?.hasError("required")) {
      const fieldNames: { [key: string]: string } = {
        firstName: "Nombre",
        lastName: "Apellido",
        username: "Usuario",
        email: "Email",
        password: "Contraseña",
        confirmPassword: "Confirmar contraseña",
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

    if (control?.hasError("passwordMismatch")) {
      return "Las contraseñas no coinciden"
    }

    return ""
  }
}
