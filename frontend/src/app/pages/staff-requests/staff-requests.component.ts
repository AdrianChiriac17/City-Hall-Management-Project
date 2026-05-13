import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RequestService, StaffRequest } from '../../services/request.service';

const STATUSES = ['Submitted', 'InProgress', 'Resolved', 'Rejected'];

@Component({
  selector: 'app-staff-requests',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './staff-requests.component.html',
  styleUrls: ['./staff-requests.component.css']
})
export class StaffRequestsComponent implements OnInit {
  private readonly requestService = inject(RequestService);
  private readonly cdr = inject(ChangeDetectorRef);

  requests: StaffRequest[] = [];
  isLoading = true;
  error = '';

  readonly statuses = STATUSES;

  pendingStatus: Record<string, string> = {};
  pendingNote: Record<string, string> = {};
  savingId: string | null = null;
  saveMessage: Record<string, { text: string; success: boolean }> = {};

  ngOnInit(): void {
    this.requestService.getAllRequests().subscribe({
      next: data => {
        this.requests = data;
        data.forEach(r => {
          this.pendingStatus[r.id] = r.status;
          this.pendingNote[r.id] = '';
        });
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load requests.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  saveStatus(req: StaffRequest): void {
    this.savingId = req.id;
    this.saveMessage[req.id] = { text: '', success: false };

    this.requestService.updateStatus(req.id, this.pendingStatus[req.id], this.pendingNote[req.id]).subscribe({
      next: updated => {
        const idx = this.requests.findIndex(r => r.id === updated.id);
        if (idx !== -1) this.requests[idx] = updated;
        this.pendingStatus[updated.id] = updated.status;
        this.pendingNote[updated.id] = '';
        this.savingId = null;
        this.saveMessage[req.id] = { text: 'Saved', success: true };
        this.cdr.detectChanges();
        setTimeout(() => { this.saveMessage[req.id] = { text: '', success: false }; this.cdr.detectChanges(); }, 2500);
      },
      error: err => {
        this.savingId = null;
        this.saveMessage[req.id] = { text: err.error?.message || 'Error', success: false };
        this.cdr.detectChanges();
      }
    });
  }

  statusClass(status: string): string {
    switch (status) {
      case 'Submitted':   return 'status--submitted';
      case 'InProgress':  return 'status--in-progress';
      case 'Resolved':    return 'status--resolved';
      case 'Rejected':    return 'status--rejected';
      case 'Cancelled':   return 'status--cancelled';
      default:            return '';
    }
  }
}
