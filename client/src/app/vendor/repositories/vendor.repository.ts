import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../core/config/environment';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints.constant';
import { Vendor, UpdateVendorRequest } from '../../shared/models/vendor.model';
import { ApiResponse } from '../../shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class VendorRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getProfile(): Observable<ApiResponse<Vendor>> {
    return this.http.get<ApiResponse<Vendor>>(`${this.apiUrl}${API_ENDPOINTS.VENDORS.PROFILE}`);
  }

  updateProfile(payload: UpdateVendorRequest): Observable<ApiResponse<Vendor>> {
    return this.http.put<ApiResponse<Vendor>>(`${this.apiUrl}${API_ENDPOINTS.VENDORS.PROFILE}`, payload);
  }

  getDashboardStats(): Observable<ApiResponse<{ totalVenues: number; totalBookings: number; totalRevenue: number; pendingBookings: number }>> {
    return this.http.get<ApiResponse<{ totalVenues: number; totalBookings: number; totalRevenue: number; pendingBookings: number }>>(
      `${this.apiUrl}${API_ENDPOINTS.VENDORS.ANALYTICS}`
    );
  }
}
