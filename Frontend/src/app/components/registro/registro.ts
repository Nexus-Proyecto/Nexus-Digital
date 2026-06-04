import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Campos del formulario
  nombre = '';
  apellido = '';
  email = '';
  password = '';
  passwordConfirm = '';
  rol = 'comprador';

  // Estados
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  validationErrors: { [key: string]: string } = {};

  /**
   * Ejecuta las validaciones locales antes de enviar los datos al backend.
   */
  validarFormulario(): boolean {
    this.validationErrors = {};

    if (!this.nombre.trim()) {
      this.validationErrors['nombre'] = 'El nombre es obligatorio.';
    }
    if (!this.apellido.trim()) {
      this.validationErrors['apellido'] = 'El apellido es obligatorio.';
    }
    if (!this.email.trim()) {
      this.validationErrors['email'] = 'El correo electrónico es obligatorio.';
    } else if (!this.validarEmail(this.email)) {
      this.validationErrors['email'] = 'El formato del correo electrónico no es válido.';
    }

    if (!this.password) {
      this.validationErrors['password'] = 'La contraseña es obligatoria.';
    } else if (this.password.length < 8) {
      this.validationErrors['password'] = 'La contraseña debe tener al menos 8 caracteres.';
    }

    if (!this.passwordConfirm) {
      this.validationErrors['passwordConfirm'] = 'Debes confirmar la contraseña.';
    } else if (this.password !== this.passwordConfirm) {
      this.validationErrors['passwordConfirm'] = 'Las contraseñas no coinciden.';
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
    this.successMessage = '';

    const datosRegistro = {
      nombre: this.nombre.trim(),
      apellido: this.apellido.trim(),
      email: this.email.trim(),
      password: this.password,
      password_confirm: this.passwordConfirm,
      rol: this.rol
    };

    this.authService.registrarUsuario(datosRegistro).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = '¡Registro exitoso! Tu cuenta ha sido creada. Redirigiendo...';
        
        // Redirigir después de 2.5 segundos
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2500);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.error) {
          if (typeof err.error === 'object') {
            // Mapear los errores que devuelve Django REST Framework
            const apiErrors = err.error;
            let msg = '';
            
            // Si el backend responde con errores específicos por campo
            for (const key in apiErrors) {
              if (apiErrors.hasOwnProperty(key)) {
                const fieldError = apiErrors[key];
                const cleanKey = key === 'password_confirm' ? 'Confirmar Contraseña' : key;
                msg += `${cleanKey.charAt(0).toUpperCase() + cleanKey.slice(1)}: ${Array.isArray(fieldError) ? fieldError.join(' ') : fieldError}\n`;
              }
            }
            this.errorMessage = msg || 'Ocurrió un error al procesar el registro.';
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
