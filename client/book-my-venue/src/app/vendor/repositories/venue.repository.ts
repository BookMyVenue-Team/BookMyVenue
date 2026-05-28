import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../core/config/environment';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints.constant';
import { Venue, CreateVenueRequest, UpdateVenueRequest } from '../../shared/models/venue.model';
import { ApiResponse, PaginationResponse } from '../../shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class VendorVenueRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getVendorVenues(): Observable<PaginationResponse<Venue>> {
    return this.http.get<PaginationResponse<Venue>>(`${this.apiUrl}${API_ENDPOINTS.VENDORS.BASE}/venues`);
  }

  getVenueById(id: string): Observable<ApiResponse<Venue>> {
    return this.http.get<ApiResponse<Venue>>(`${this.apiUrl}${API_ENDPOINTS.VENUES.BY_ID(id)}`);
  }

  createVenue(payload: CreateVenueRequest): Observable<ApiResponse<Venue>> {
    return this.http.post<ApiResponse<Venue>>(`${this.apiUrl}${API_ENDPOINTS.VENUES.BASE}`, payload);
  }

  updateVenue(id: string, payload: UpdateVenueRequest): Observable<ApiResponse<Venue>> {
    return this.http.put<ApiResponse<Venue>>(`${this.apiUrl}${API_ENDPOINTS.VENUES.BY_ID(id)}`, payload);
  }

  deleteVenue(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}${API_ENDPOINTS.VENUES.BY_ID(id)}`);
  }
}
