import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../core/config/environment';
import { Booking } from '../../shared/models/booking.model';
import { ApiResponse, PaginationResponse } from '../../shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class VendorBookingRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getVendorBookings(): Observable<PaginationResponse<Booking>> {
    // Backend endpoint not available - do not use
    // Returning empty data until backend implements vendor bookings endpoint
    return of({
      success: false,
      data: [],
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    });
  }

  updateBookingStatus(id: string, status: string): Observable<ApiResponse<Booking>> {
    const byIdEndpoint = `/bookings/${id}`;
    return this.http.patch<ApiResponse<Booking>>(`${this.apiUrl}${byIdEndpoint}`, { status });
  }
}