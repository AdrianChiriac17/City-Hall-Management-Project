import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Announcement } from '../../services/announcement.service';
import { environment } from '../../../environments/environment';

interface DashboardStats {
  citizenCount: number;
  requestCount: number;
  documentCount: number;
  announcementCount: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);

  stats: DashboardStats | null = null;
  recentAnnouncements: Announcement[] = [];
  statsLoading = true;
  annLoading = true;
  statsError = '';
  annError = '';

  ngOnInit(): void {
    this.http.get<DashboardStats>(`${environment.apiUrl}/dashboard/stats`).subscribe({
      next: s => {
        this.stats = s;
        this.statsLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.statsError = 'Could not load statistics.';
        this.statsLoading = false;
        this.cdr.detectChanges();
      }
    });

    this.http.get<Announcement[]>(`${environment.apiUrl}/dashboard/recent-announcements`).subscribe({
      next: items => {
        this.recentAnnouncements = items;
        this.annLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.annError = 'Could not load announcements.';
        this.annLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
