import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DocumentSummary {
  id: string;
  title: string;
  approvalStatus: string;
  fileSizeBytes: number;
  uploadedAt: string;
  originalFileName: string;
}

export interface DocumentDetail extends DocumentSummary {
  description: string | null;
  rejectionReason: string | null;
  reviewedByName: string | null;
  reviewedAt: string | null;
  url: string;
  ownerName: string;
}

export interface ReviewDocumentPayload {
  isApproved: boolean;
  rejectionReason?: string;
}

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly baseUrl = `${environment.apiUrl}`;

  constructor(private readonly http: HttpClient) {}

  getMyDocuments(): Observable<DocumentSummary[]> {
    return this.http.get<DocumentSummary[]>(
      `${this.baseUrl}/my-documents`,
      { withCredentials: true }
    );
  }

  getMyDocument(id: string): Observable<DocumentDetail> {
    return this.http.get<DocumentDetail>(
      `${this.baseUrl}/my-documents/${id}`,
      { withCredentials: true }
    );
  }

  uploadDocument(formData: FormData): Observable<DocumentDetail> {
    return this.http.post<DocumentDetail>(
      `${this.baseUrl}/my-documents`,
      formData,
      { withCredentials: true }
    );
  }

  deleteDocument(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/my-documents/${id}`,
      { withCredentials: true }
    );
  }

  getPendingDocuments(): Observable<DocumentDetail[]> {
    return this.http.get<DocumentDetail[]>(
      `${this.baseUrl}/admin/documents/pending`,
      { withCredentials: true }
    );
  }

  getDocumentForReview(id: string): Observable<DocumentDetail> {
    return this.http.get<DocumentDetail>(
      `${this.baseUrl}/admin/documents/${id}`,
      { withCredentials: true }
    );
  }

  reviewDocument(id: string, payload: ReviewDocumentPayload): Observable<DocumentDetail> {
    return this.http.post<DocumentDetail>(
      `${this.baseUrl}/admin/documents/${id}/review`,
      payload,
      { withCredentials: true }
    );
  }
}
