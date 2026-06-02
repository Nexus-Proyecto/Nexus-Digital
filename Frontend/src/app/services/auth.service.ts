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
      } catch (e) {
        localStorage.removeItem('nexus_user');
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
        // Guardar datos del usuario devueltos por el backend
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
    localStorage.removeItem('nexus_user');
    this.currentUser.set(null);
  }
}
