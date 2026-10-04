import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://127.0.0.1:8000/api';

  // Estado reactivo del usuario logueado en la aplicación
  readonly currentUser = signal<any | null>(null);

  constructor() {
    this.inicializarSesion();
  }

  /**
   * Intenta recuperar la sesión activa del localStorage al cargar el servicio.
   */
  private inicializarSesion(): void {
    const userJson = localStorage.getItem('nexus_user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUser.set(user);
        if (user?.access && !localStorage.getItem('auth_token')) {
          localStorage.setItem('auth_token', user.access);
        }
      } catch (e) {
        localStorage.removeItem('nexus_user');
        localStorage.removeItem('auth_token');
      }
    }
  }

  /**
   * Registra un nuevo usuario en la plataforma.
   * @param datos Objeto con los datos de registro (nombre, apellido, email, password, password_confirm, rol)
   */
  registrarUsuario(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register/`, datos);
  }

  /**
   * Inicia sesión de un usuario y guarda su sesión en localStorage.
   * @param credenciales Objeto con email y password
   */
  login(credenciales: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login/`, credenciales).pipe(
      tap((response) => {
        // Guardar token para el interceptor HTTP y datos del usuario
        if (response?.access) {
          localStorage.setItem('auth_token', response.access);
        }
        localStorage.setItem('nexus_user', JSON.stringify(response));
        // Actualizar el estado global reactivo
        this.currentUser.set(response);
      })
    );
  }

  /**
   * Cierra la sesión activa del usuario, eliminando los datos locales.
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('nexus_user');
    this.currentUser.set(null);
  }
}
