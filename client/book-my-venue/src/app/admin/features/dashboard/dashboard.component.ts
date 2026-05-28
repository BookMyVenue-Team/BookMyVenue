import { Component, signal, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard', standalone: true,
  templateUrl: './dashboard.component.html', styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  readonly stats = signal({ totalUsers: 0, totalVendors: 0, totalVenues: 0, totalBookings: 0, totalRevenue: 0 });
}
