import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartSummaryComponent } from '../../../components/cart-summary/cart-summary.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CartSummaryComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {}