import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RequestService, CitizenRequest } from '../../services/request.service';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.css']
})
export class MyRequestsComponent implements OnInit {
  private readonly requestService = inject(RequestService);
  private readonly cdr = inject(ChangeDetectorRef);

  requests: CitizenRequest[] = [];
  isLoading = true;
  error = '';
  cancellingId: string | null = null;
  cancelMessage = '';
  isCancelSuccess = false;

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.isLoading = true;
    this.requestService.getMyRequests().subscribe({
      next: data => {
        this.requests = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load requests. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancel(id: string): void {
    this.cancelMessage = '';
    this.cancellingId = id;

    this.requestService.cancelRequest(id).subscribe({
      next: res => {
        this.cancelMessage = res.message;
        this.isCancelSuccess = true;
        this.cancellingId = null;
        const req = this.requests.find(r => r.id === id);
        if (req) req.status = 'Cancelled';
        this.cdr.detectChanges();
      },
      error: err => {
        this.cancelMessage = err.error?.message || 'Failed to cancel request.';
        this.isCancelSuccess = false;
        this.cancellingId = null;
        this.cdr.detectChanges();
      }
    });
  }

  canCancel(status: string): boolean {
    return status === 'Submitted';
  }

  statusClass(status: string): string {
    switch (status) {
      case 'Submitted':   return 'status--submitted';
      case 'InProgress':  return 'status--in-progress';
      case 'Resolved':    return 'status--resolved';
      case 'Cancelled':   return 'status--cancelled';
      default:            return '';
    }
  }
}
