import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ForumAttachment {
  id: string;
  originalFileName: string;
  url: string;
  contentType: string;
  fileSizeBytes: number;
}

export interface ForumPost {
  id: string;
  content: string;
  authorName: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  attachments: ForumAttachment[];
}

export interface ForumThreadListItem {
  id: string;
  title: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  replyCount: number;
  isClosed: boolean;
}

export interface ForumThreadDetail {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  isClosed: boolean;
  attachments: ForumAttachment[];
  posts: ForumPost[];
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

@Injectable({ providedIn: 'root' })
export class ForumService {
  private readonly apiUrl = `${environment.apiUrl}/forum`;

  constructor(private readonly http: HttpClient) {}

  getThreads(page = 1, pageSize = 20): Observable<PagedResult<ForumThreadListItem>> {
    return this.http.get<PagedResult<ForumThreadListItem>>(
      `${this.apiUrl}/threads?page=${page}&pageSize=${pageSize}`,
      { withCredentials: true }
    );
  }

  getThread(id: string): Observable<ForumThreadDetail> {
    return this.http.get<ForumThreadDetail>(
      `${this.apiUrl}/threads/${id}`,
      { withCredentials: true }
    );
  }

  createThread(data: { title: string; content: string }): Observable<ForumThreadDetail> {
    return this.http.post<ForumThreadDetail>(
      `${this.apiUrl}/threads`,
      data,
      { withCredentials: true }
    );
  }

  createPost(threadId: string, data: { content: string }): Observable<ForumPost> {
    return this.http.post<ForumPost>(
      `${this.apiUrl}/threads/${threadId}/posts`,
      data,
      { withCredentials: true }
    );
  }

  uploadThreadAttachment(threadId: string, file: File): Observable<ForumAttachment> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ForumAttachment>(
      `${this.apiUrl}/threads/${threadId}/attachments`,
      formData,
      { withCredentials: true }
    );
  }

  uploadPostAttachment(postId: string, file: File): Observable<ForumAttachment> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ForumAttachment>(
      `${this.apiUrl}/posts/${postId}/attachments`,
      formData,
      { withCredentials: true }
    );
  }

  updateThread(threadId: string, data: { title: string; content: string }): Observable<ForumThreadDetail> {
    return this.http.put<ForumThreadDetail>(
      `${this.apiUrl}/threads/${threadId}`,
      data,
      { withCredentials: true }
    );
  }

  updatePost(postId: string, data: { content: string }): Observable<ForumPost> {
    return this.http.put<ForumPost>(
      `${this.apiUrl}/posts/${postId}`,
      data,
      { withCredentials: true }
    );
  }

  toggleThreadClosed(threadId: string): Observable<{ isClosed: boolean }> {
    return this.http.patch<{ isClosed: boolean }>(
      `${this.apiUrl}/threads/${threadId}/close`,
      {},
      { withCredentials: true }
    );
  }

  deleteThread(threadId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/threads/${threadId}`,
      { withCredentials: true }
    );
  }

  deletePost(postId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/posts/${postId}`,
      { withCredentials: true }
    );
  }
}
