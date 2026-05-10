import { Component } from '@angular/core';

import { DashboardAdmin } from '../dashboard-admin/dashboard-admin';
import { DashboardUser } from '../dashboard-user/dashboard-user';

@Component({
  selector: 'app-main-dashboard',

  imports: [
    DashboardAdmin,
    DashboardUser
  ],

  templateUrl: './main-dashboard.html',
  styleUrl: './main-dashboard.css',
})

export class MainDashboard {

  rol = 'Admin';

  cambiarRol() {

    this.rol = this.rol === 'Admin'
      ? 'Usuario'
      : 'Admin';

  }

}