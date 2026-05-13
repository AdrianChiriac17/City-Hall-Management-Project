import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly apiUrl = `${environment.apiUrl}/admin`;

  constructor(private readonly http: HttpClient) {}

  getUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiUrl}/users`, { withCredentials: true });
  }

  getRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/roles`, { withCredentials: true });
  }

  updateUserRoles(userId: string, roles: string[]): Observable<AdminUser> {
    return this.http.put<AdminUser>(
      `${this.apiUrl}/users/${userId}/roles`,
      { roles },
      { withCredentials: true }
    );
  }
}