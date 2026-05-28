import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../core/config/environment';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints.constant';
import { Vendor } from '../../shared/models/vendor.model';
import { ApiResponse, PaginationResponse } from '../../shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class AdminVendorRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getVendors(page = 1, limit = 10): Observable<PaginationResponse<Vendor>> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<PaginationResponse<Vendor>>(`${this.apiUrl}${API_ENDPOINTS.ADMIN.VENDORS}`, { params });
  }

  getVendorById(id: string): Observable<ApiResponse<Vendor>> {
    return this.http.get<ApiResponse<Vendor>>(`${this.apiUrl}${API_ENDPOINTS.VENDORS.BY_ID(id)}`);
  }

  verifyVendor(id: string): Observable<ApiResponse<Vendor>> {
    return this.http.patch<ApiResponse<Vendor>>(`${this.apiUrl}${API_ENDPOINTS.VENDORS.BY_ID(id)}`, { isVerified: true });
  }

  toggleVendorStatus(id: string, isActive: boolean): Observable<ApiResponse<Vendor>> {
    return this.http.patch<ApiResponse<Vendor>>(`${this.apiUrl}${API_ENDPOINTS.VENDORS.BY_ID(id)}`, { isActive });
  }
}
