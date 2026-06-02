import { Injectable, inject, signal } from '@angular/core';
import { AdminVenueRepository } from '../repositories/venue.repository';
import { Venue } from '../../shared/models/venue.model';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable({ providedIn: 'root' })
export class AdminVenueService {
  private readonly venueRepository = inject(AdminVenueRepository);
  private readonly notification = inject(NotificationService);

  readonly venues = signal<Venue[]>([]);
  readonly loading = signal(false);

  loadVenues(page = 1): void {
    this.loading.set(true);
    this.venueRepository.getVenues(page).subscribe({
      next: (r) => { this.venues.set(r.data); this.loading.set(false); },
      error: () => { this.notification.error('Failed to load venues'); this.loading.set(false); },
    });
  }
}
