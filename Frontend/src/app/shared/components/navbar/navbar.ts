import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  searchQuery: string = '';
  readonly currentUser = this.authService.currentUser;

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/resultados'], {
        queryParams: { q: this.searchQuery }
      });
      this.searchQuery = '';
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}