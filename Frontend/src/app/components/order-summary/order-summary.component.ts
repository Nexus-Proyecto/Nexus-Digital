import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnInit {
  order: any = null;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.order = navigation?.extras?.state?.['order'];
  }

  ngOnInit(): void {
    if (!this.order) {
      this.router.navigate(['/']);
    }
  }
}