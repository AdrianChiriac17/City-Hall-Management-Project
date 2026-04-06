import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

interface ServiceRequest {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-root',
  imports: [DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly http = inject(HttpClient);

  protected readonly title = signal('City Hall Requests');
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly requests = signal<ServiceRequest[]>([]);
  protected readonly baseUrl = 'http://localhost:5009';

  public ngOnInit(): void {
    this.loadRequests();
  }

  protected loadRequests(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<ServiceRequest[]>(`${this.baseUrl}/api/requests`).subscribe({
      next: (data) => {
        this.requests.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not reach the API. Make sure the backend is running on localhost:5009.');
        this.loading.set(false);
      }
    });
  }
}
