import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RequestService, RequestItem } from '../../services/request.service';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.css']
})
export class MyRequestsComponent implements OnInit {
  private readonly requestService = inject(RequestService);
  private readonly cdr = inject(ChangeDetectorRef);

  requests: RequestItem[] = [];
  isLoading = true;
  error = '';

  showForm = false;
  submitting = false;
  submitError = '';
  submitSuccess = false;

  title = '';
  description = '';

  editingId: string | null = null;
  editTitle = '';
  editDescription = '';
  editSaving = false;
  editError = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
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

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.submitError = '';
    this.submitSuccess = false;
    if (!this.showForm) {
      this.title = '';
      this.description = '';
    }
  }

  submit(): void {
    if (!this.title.trim() || !this.description.trim()) {
      this.submitError = 'Title and description are required.';
      return;
    }

    this.submitting = true;
    this.submitError = '';

    this.requestService.createMyRequest({ title: this.title.trim(), description: this.description.trim() }).subscribe({
      next: newRequest => {
        this.requests.unshift(newRequest);
        this.submitting = false;
        this.submitSuccess = true;
        this.title = '';
        this.description = '';
        this.showForm = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.submitError = 'Failed to submit request. Please try again.';
        this.submitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  startEdit(req: RequestItem): void {
    this.editingId = req.id;
    this.editTitle = req.title;
    this.editDescription = req.description;
    this.editError = '';
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editError = '';
  }

  saveEdit(req: RequestItem): void {
    if (!this.editTitle.trim() || !this.editDescription.trim()) {
      this.editError = 'Title and description are required.';
      return;
    }
    this.editSaving = true;
    this.editError = '';

    this.requestService.updateMyRequest(req.id, {
      title: this.editTitle.trim(),
      description: this.editDescription.trim()
    }).subscribe({
      next: updated => {
        req.title = updated.title;
        req.description = updated.description;
        req.updatedAt = updated.updatedAt;
        this.editingId = null;
        this.editSaving = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.editError = 'Failed to save changes. Please try again.';
        this.editSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancelRequest(req: RequestItem): void {
    if (!confirm('Cancel this request? This cannot be undone.')) return;

    this.requestService.cancelMyRequest(req.id).subscribe({
      next: () => {
        this.requests = this.requests.filter(r => r.id !== req.id);
        this.cdr.detectChanges();
      },
      error: () => {
        this.cdr.detectChanges();
      }
    });
  }

  statusClass(status: string): string {
    return 'status--' + status.toLowerCase().replace(/\s+/g, '-');
  }
}
