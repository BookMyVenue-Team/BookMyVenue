import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../core/config/environment';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints.constant';
import { Booking, CreateBookingRequest } from '../../shared/models/booking.model';
import { ApiResponse, PaginationResponse } from '../../shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class BookingRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getUserBookings(): Observable<PaginationResponse<Booking>> {
    return this.http.get<PaginationResponse<Booking>>(
      `${this.apiUrl}${API_ENDPOINTS.BOOKINGS.BASE}`
    );
  }

  getBookingById(id: string): Observable<ApiResponse<Booking>> {
    return this.http.get<ApiResponse<Booking>>(
      `${this.apiUrl}${API_ENDPOINTS.BOOKINGS.BY_ID(id)}`
    );
  }

  createBooking(payload: CreateBookingRequest): Observable<ApiResponse<Booking>> {
    return this.http.post<ApiResponse<Booking>>(
      `${this.apiUrl}${API_ENDPOINTS.BOOKINGS.BASE}`,
      payload
    );
  }

  cancelBooking(id: string): Observable<ApiResponse<Booking>> {
    return this.http.patch<ApiResponse<Booking>>(
      `${this.apiUrl}${API_ENDPOINTS.BOOKINGS.BY_ID(id)}`,
      { status: 'cancelled' }
    );
  }
}
