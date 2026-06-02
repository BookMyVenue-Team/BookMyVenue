import { Injectable, inject, signal } from '@angular/core';
import { Observable, map } from 'rxjs';
import { VendorVenueRepository } from '../repositories/venue.repository';
import { Venue, CreateVenueRequest, UpdateVenueRequest } from '../../shared/models/venue.model';
import { NotificationService } from '../../shared/services/notification.service';
import { ApiResponse } from '../../shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class VenueService {
  private readonly venueRepository = inject(VendorVenueRepository);
  private readonly notification = inject(NotificationService);

  readonly venues = signal<Venue[]>([]);
  readonly loading = signal(false);

  loadVendorVenues(): void {
    this.loading.set(true);
    this.venueRepository.getVendorVenues().subscribe({
      next: (response) => { this.venues.set(response.data); this.loading.set(false); },
      error: () => { this.notification.error('Failed to load venues'); this.loading.set(false); },
    });
  }

  loadVenueById(id: string): Observable<Venue> {
    return this.venueRepository.getVenueById(id).pipe(map(r => r.data));
  }

  createVenue(payload: CreateVenueRequest): Observable<ApiResponse<Venue>> {
    return this.venueRepository.createVenue(payload);
  }

  updateVenue(id: string, payload: UpdateVenueRequest): Observable<ApiResponse<Venue>> {
    return this.venueRepository.updateVenue(id, payload);
  }
}
