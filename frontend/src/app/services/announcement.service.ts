import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  isImportant: boolean;
  authorName: string;
  authorUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementsPage {
  items: Announcement[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

@Injectable({ providedIn: 'root' })
export class AnnouncementService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/announcements`;

  getAll(page = 1, pageSize = 20, search = '', importantOnly = false): Observable<AnnouncementsPage> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize)
      .set('importantOnly', importantOnly);
    if (search) params = params.set('search', search);
    return this.http.get<AnnouncementsPage>(this.base, { params });
  }

  getById(id: string): Observable<Announcement> {
    return this.http.get<Announcement>(`${this.base}/${id}`);
  }

  create(data: { title: string; content: string; isImportant: boolean }): Observable<Announcement> {
    return this.http.post<Announcement>(this.base, data);
  }

  update(id: string, data: { title: string; content: string; isImportant: boolean }): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
