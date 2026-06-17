// src/app/user/services/slot.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../core/config/environment';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints.constant';
import { TimeSlot } from '../../shared/models/slot.model';

@Injectable({ providedIn: 'root' })
export class SlotService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  readonly slots = signal<TimeSlot[]>([]);
  readonly loading = signal(false);

  loadSlotsForVenue(venueId: string): Observable<{ data: TimeSlot[] }> {
    return this.http.get<{ data: TimeSlot[] }>(
      `${this.apiUrl}${API_ENDPOINTS.VENUES.SLOTS(venueId)}`
    );
  }


  getDummySlots(): TimeSlot[] {
    return [
      { id: 1, label: 'Morning', startTime: '09:00', endTime: '12:00', duration: '3 hrs', available: true, surcharge: 0 },
      { id: 2, label: 'Afternoon', startTime: '12:00', endTime: '16:00', duration: '4 hrs', available: true, surcharge: 2000 },
      { id: 3, label: 'Evening', startTime: '16:00', endTime: '20:00', duration: '4 hrs', available: false, surcharge: 3000 },
      { id: 4, label: 'Night', startTime: '20:00', endTime: '23:00', duration: '3 hrs', available: true, surcharge: 1500 },
      { id: 5, label: 'Full Day', startTime: '09:00', endTime: '23:00', duration: '14 hrs', available: true, surcharge: 8000 },
      { id: 6, label: 'Half Day AM', startTime: '09:00', endTime: '14:00', duration: '5 hrs', available: true, surcharge: 1000 },
    ];
  }
}