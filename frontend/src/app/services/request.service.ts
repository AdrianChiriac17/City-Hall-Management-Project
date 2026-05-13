import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CitizenRequest {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestPayload {
  title: string;
  description: string;
}

export interface StaffRequest {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  citizenProfile: { id: string } | null;
}

@Injectable({ providedIn: 'root' })
export class RequestService {
  private readonly apiUrl = `${environment.apiUrl}/requests`;

  constructor(private readonly http: HttpClient) {}

  getMyRequests(): Observable<CitizenRequest[]> {
    return this.http.get<CitizenRequest[]>(`${this.apiUrl}/my`, { withCredentials: true });
  }

  createRequest(payload: CreateRequestPayload): Observable<CitizenRequest> {
    return this.http.post<CitizenRequest>(this.apiUrl, payload, { withCredentials: true });
  }

  getAllRequests(): Observable<StaffRequest[]> {
    return this.http.get<StaffRequest[]>(this.apiUrl, { withCredentials: true });
  }

  updateStatus(id: string, status: string, note: string): Observable<StaffRequest> {
    return this.http.put<StaffRequest>(`${this.apiUrl}/${id}/status`, { status, note }, { withCredentials: true });
  }

  cancelRequest(id: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/${id}/cancel`, {}, { withCredentials: true });
  }
}
