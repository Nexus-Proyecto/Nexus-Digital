import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-admin',

  imports: [],

  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css',
})

export class DashboardAdmin {

  opcionesAdmin = [

    'Gestionar usuarios',
    'Ver reportes',
    'Administrar productos'

  ];

}