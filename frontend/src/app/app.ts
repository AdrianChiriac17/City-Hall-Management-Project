import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

interface NavLink {
  label: string;
  href: string;
}

export interface CityRequest {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  citizenProfile?: { firstName: string; lastName: string };
  department?: { name: string };
}

@Component({
  selector: 'app-root',
  imports: [DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly authTokenKey = 'chms.authToken';
  private http = inject(HttpClient);

  protected readonly title = signal('City Hall Management');
  protected readonly isLoggedIn = signal(false);
  protected readonly recentRequests = signal<CityRequest[]>([]);

  protected readonly guestLinks: NavLink[] = [
    { label: 'Register as Citizen', href: '/register' },
    { label: 'Log In', href: '/login' }
  ];

  protected readonly memberLinks: NavLink[] = [
    { label: 'Profile', href: '/profile' },
    { label: 'Dashboard', href: '/dashboard' }
  ];

  protected readonly navLinks = computed(() => this.isLoggedIn() ? this.memberLinks : this.guestLinks);

  public constructor() {
    if (typeof window !== 'undefined') {
      this.isLoggedIn.set(Boolean(localStorage.getItem(this.authTokenKey)));
    }
  }

  ngOnInit() {
    this.http.get<CityRequest[]>('https://localhost:7248/api/requests')
      .subscribe({
        next: (data) => this.recentRequests.set(data.slice(0, 3)), // show up to 3
        error: (err) => console.error('Failed to fetch requests', err)
      });
  }
}
