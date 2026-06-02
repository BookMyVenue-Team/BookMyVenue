import { Injectable, inject, signal } from '@angular/core';
import { AdminVendorRepository } from '../repositories/vendor.repository';
import { Vendor } from '../../shared/models/vendor.model';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable({ providedIn: 'root' })
export class AdminVendorService {
  private readonly vendorRepository = inject(AdminVendorRepository);
  private readonly notification = inject(NotificationService);

  readonly vendors = signal<Vendor[]>([]);
  readonly loading = signal(false);
  readonly totalPages = signal(1);

  loadVendors(page = 1): void {
    this.loading.set(true);
    this.vendorRepository.getVendors(page).subscribe({
      next: (r) => { this.vendors.set(r.data); this.totalPages.set(r.totalPages); this.loading.set(false); },
      error: () => { this.notification.error('Failed to load vendors'); this.loading.set(false); },
    });
  }
}
