import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../core/config/environment';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints.constant';
import { Venue, VenueFilter } from '../../shared/models/venue.model';
import { ApiResponse, PaginationResponse } from '../../shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class VenueRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getVenues(filter?: VenueFilter): Observable<PaginationResponse<Venue>> {
    let params = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, String(value));
        }
      });
    }
    return this.http.get<PaginationResponse<Venue>>(
      `${this.apiUrl}${API_ENDPOINTS.VENUES.BASE}`,
      { params }
    );
  }

  getVenueById(id: string): Observable<ApiResponse<Venue>> {
    return this.http.get<ApiResponse<Venue>>(
      `${this.apiUrl}${API_ENDPOINTS.VENUES.BY_ID(id)}`
    );
  }

  searchVenues(query: string): Observable<PaginationResponse<Venue>> {
    return this.http.get<PaginationResponse<Venue>>(
      `${this.apiUrl}${API_ENDPOINTS.VENUES.SEARCH}`,
      { params: new HttpParams().set('q', query) }
    );
  }
}
