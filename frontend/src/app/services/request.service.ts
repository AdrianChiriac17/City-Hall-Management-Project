import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RequestHistoryEntry {
  id: string;
  status: string;
  note: string;
  changedAt: string;
  changedByUserId: string;
}

export interface RequestItem {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  departmentId: string | null;
  department: { id: string; name: string } | null;
  citizenProfileId: string;
  citizenProfile: {
    id: string;
    userId: string;
    user: { firstName: string; lastName: string; email: string } | null;
  } | null;
  history: RequestHistoryEntry[];
}

export interface CreateMyRequestPayload {
  title: string;
  description: string;
}

export interface UpdateRequestStatusPayload {
  status: string;
  note: string;
  changedByUserId: string;
}

@Injectable({ providedIn: 'root' })
export class RequestService {
  private readonly baseUrl = `${environment.apiUrl}/requests`;

  constructor(private readonly http: HttpClient) {}

  getMyRequests(): Observable<RequestItem[]> {
    return this.http.get<RequestItem[]>(`${this.baseUrl}/my`, { withCredentials: true });
  }

  createMyRequest(payload: CreateMyRequestPayload): Observable<RequestItem> {
    return this.http.post<RequestItem>(`${this.baseUrl}/my`, payload, { withCredentials: true });
  }

  updateMyRequest(id: string, payload: CreateMyRequestPayload): Observable<RequestItem> {
    return this.http.patch<RequestItem>(`${this.baseUrl}/my/${id}`, payload, { withCredentials: true });
  }

  cancelMyRequest(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/my/${id}`, { withCredentials: true });
  }

  getAllRequests(): Observable<RequestItem[]> {
    return this.http.get<RequestItem[]>(this.baseUrl, { withCredentials: true });
  }

  updateStatus(id: string, payload: UpdateRequestStatusPayload): Observable<RequestItem> {
    return this.http.put<RequestItem>(`${this.baseUrl}/${id}/status`, payload, { withCredentials: true });
  }
}
