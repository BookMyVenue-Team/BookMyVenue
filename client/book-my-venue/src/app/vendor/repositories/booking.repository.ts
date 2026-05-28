import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../core/config/environment';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints.constant';
import { Booking } from '../../shared/models/booking.model';
import { ApiResponse, PaginationResponse } from '../../shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class VendorBookingRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getVendorBookings(): Observable<PaginationResponse<Booking>> {
    return this.http.get<PaginationResponse<Booking>>(`${this.apiUrl}${API_ENDPOINTS.BOOKINGS.BY_VENDOR}`);
  }

  updateBookingStatus(id: string, status: string): Observable<ApiResponse<Booking>> {
    return this.http.patch<ApiResponse<Booking>>(`${this.apiUrl}${API_ENDPOINTS.BOOKINGS.BY_ID(id)}`, { status });
  }
}
