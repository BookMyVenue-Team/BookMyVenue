import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../core/config/environment';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints.constant';
import { User } from '../../shared/models/user.model';
import { ApiResponse, PaginationResponse } from '../../shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class AdminUserRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getUsers(page = 1, limit = 10): Observable<PaginationResponse<User>> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<PaginationResponse<User>>(`${this.apiUrl}${API_ENDPOINTS.ADMIN.USERS}`, { params });
  }

  getUserById(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}${API_ENDPOINTS.USERS.BY_ID(id)}`);
  }

  toggleUserStatus(id: string, isActive: boolean): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.apiUrl}${API_ENDPOINTS.USERS.BY_ID(id)}`, { isActive });
  }
}
