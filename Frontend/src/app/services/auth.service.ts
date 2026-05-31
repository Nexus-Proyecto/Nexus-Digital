import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://127.0.0.1:8000/api';

  /**
   * Registra un nuevo usuario en la plataforma.
   * @param datos Objeto con los datos de registro (nombre, apellido, email, password, password_confirm, rol)
   */
  registrarUsuario(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register/`, datos);
  }
}
