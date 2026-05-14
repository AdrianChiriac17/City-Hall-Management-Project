import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RequestService, RequestItem } from '../../services/request.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  private readonly requestService = inject(RequestService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  requests: RequestItem[] = [];
  isLoading = true;
  error = '';

  expandedId: string | null = null;

  statusOptions = ['Submitted', 'In Review', 'Approved', 'Rejected', 'Completed'];
  selectedStatus: Record<string, string> = {};
  selectedNote: Record<string, string> = {};
  updating: Record<string, boolean> = {};
  updateError: Record<string, string> = {};

  ngOnInit(): void {
    this.requestService.getAllRequests().subscribe({
      next: data => {
        this.requests = data;
        this.isLoading = false;
        data.forEach(r => {
          this.selectedStatus[r.id] = r.status;
          this.selectedNote[r.id] = '';
        });
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load requests. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggle(id: string): void {
    this.expandedId = this.expandedId === id ? null : id;
    this.updateError[id] = '';
  }

  updateStatus(req: RequestItem): void {
    const userId = this.authService.currentUser?.id;
    if (!userId) return;

    this.updating[req.id] = true;
    this.updateError[req.id] = '';

    this.requestService.updateStatus(req.id, {
      status: this.selectedStatus[req.id],
      note: this.selectedNote[req.id] ?? '',
      changedByUserId: userId as unknown as string
    }).subscribe({
      next: updated => {
        const idx = this.requests.findIndex(r => r.id === req.id);
        if (idx !== -1) this.requests[idx] = { ...this.requests[idx], status: updated.status, updatedAt: updated.updatedAt };
        this.selectedNote[req.id] = '';
        this.updating[req.id] = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.updateError[req.id] = 'Failed to update status.';
        this.updating[req.id] = false;
        this.cdr.detectChanges();
      }
    });
  }

  statusClass(status: string): string {
    return 'status--' + status.toLowerCase().replace(/\s+/g, '-');
  }

  citizenName(req: RequestItem): string {
    const u = req.citizenProfile?.user;
    if (!u) return 'Unknown Citizen';
    return `${u.firstName} ${u.lastName}`;
  }
}
