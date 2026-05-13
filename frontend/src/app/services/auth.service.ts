import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneCountryCode: string;
  phoneNumber: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
}

export interface CurrentUser {
  id: number;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request, {
      withCredentials: true
    });
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request, {
      withCredentials: true
    });
  }

  loadCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${this.apiUrl}/me`, {
      withCredentials: true
    }).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  logout(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => this.currentUserSubject.next(null))
    );
  }

  clearCurrentUser(): void {
    this.currentUserSubject.next(null);
  }
}
