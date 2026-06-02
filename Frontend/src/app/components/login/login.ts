import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Campos de formulario
  email = '';
  password = '';

  // Estados
  isLoading = false;
  errorMessage = '';
  validationErrors: { [key: string]: string } = {};

  /**
   * Ejecuta validaciones locales antes de enviar al backend
   */
  validarFormulario(): boolean {
    this.validationErrors = {};

    if (!this.email.trim()) {
      this.validationErrors['email'] = 'El correo electrónico es obligatorio.';
    } else if (!this.validarEmail(this.email)) {
      this.validationErrors['email'] = 'El formato del correo electrónico no es válido.';
    }

    if (!this.password) {
      this.validationErrors['password'] = 'La contraseña es obligatoria.';
    }

    return Object.keys(this.validationErrors).length === 0;
  }

  validarEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }

  onSubmit(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credenciales = {
      email: this.email.trim(),
      password: this.password
    };

    this.authService.login(credenciales).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        // Redirigir al panel de control (dashboard)
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.isLoading = false;
        if (err.error) {
          if (typeof err.error === 'object') {
            // Manejar errores de validación o del diccionario de error retornado por DRF
            if (err.error.error) {
              this.errorMessage = err.error.error;
            } else {
              let msg = '';
              for (const key in err.error) {
                if (err.error.hasOwnProperty(key)) {
                  const fieldError = err.error[key];
                  msg += `${key.charAt(0).toUpperCase() + key.slice(1)}: ${Array.isArray(fieldError) ? fieldError.join(' ') : fieldError}\n`;
                }
              }
              this.errorMessage = msg || 'Ocurrió un error al iniciar sesión.';
            }
          } else {
            this.errorMessage = err.error;
          }
        } else {
          this.errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.';
        }
      }
    });
  }
}
