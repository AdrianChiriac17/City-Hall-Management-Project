import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DocumentService, DocumentDetail } from '../../../services/document.service';

@Component({
  selector: 'app-document-review',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, DatePipe],
  templateUrl: './document-review.component.html',
  styleUrls: ['./document-review.component.css']
})
export class DocumentReviewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly documentService = inject(DocumentService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  document: DocumentDetail | null = null;
  isLoading = true;
  isSubmitting = false;
  showRejectForm = false;
  error = '';

  rejectForm = this.fb.group({
    rejectionReason: ['', [Validators.required, Validators.maxLength(1000)]]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.documentService.getDocumentForReview(id).subscribe({
      next: doc => {
        this.document = doc;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Document not found.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  approve(): void {
    if (!this.document || this.isSubmitting) return;
    if (!confirm('Approve this document?')) return;

    this.isSubmitting = true;
    this.documentService.reviewDocument(this.document.id, { isApproved: true }).subscribe({
      next: () => this.router.navigate(['/admin/documents-approval']),
      error: err => {
        this.error = err.error?.message || 'Failed to approve the document.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  openRejectForm(): void {
    this.showRejectForm = true;
    this.cdr.detectChanges();
  }

  cancelReject(): void {
    this.showRejectForm = false;
    this.rejectForm.reset();
    this.cdr.detectChanges();
  }

  submitReject(): void {
    if (!this.document || this.isSubmitting) return;

    if (this.rejectForm.invalid) {
      this.rejectForm.markAllAsTouched();
      return;
    }

    const reason = this.rejectForm.getRawValue().rejectionReason ?? '';
    this.isSubmitting = true;
    this.documentService.reviewDocument(this.document.id, {
      isApproved: false,
      rejectionReason: reason
    }).subscribe({
      next: () => this.router.navigate(['/admin/documents-approval']),
      error: err => {
        this.error = err.error?.message || 'Failed to reject the document.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
