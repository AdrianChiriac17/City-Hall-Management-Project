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

  statusClass(status: string): string {
    return 'status--' + status.toLowerCase().replace(/\s+/g, '-');
  }
}
