import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../core/config/environment';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints.constant';
import { Venue } from '../../shared/models/venue.model';
import { ApiResponse, PaginationResponse } from '../../shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class AdminVenueRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getVenues(page = 1, limit = 10): Observable<PaginationResponse<Venue>> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<PaginationResponse<Venue>>(`${this.apiUrl}${API_ENDPOINTS.ADMIN.VENUES}`, { params });
  }

  toggleVenueStatus(id: string, status: string): Observable<ApiResponse<Venue>> {
    return this.http.patch<ApiResponse<Venue>>(`${this.apiUrl}${API_ENDPOINTS.VENUES.BY_ID(id)}`, { status });
  }
}
