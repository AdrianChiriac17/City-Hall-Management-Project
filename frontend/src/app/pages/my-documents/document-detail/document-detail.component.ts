import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DocumentService, DocumentDetail } from '../../../services/document.service';

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly documentService = inject(DocumentService);
  private readonly cdr = inject(ChangeDetectorRef);

  document: DocumentDetail | null = null;
  isLoading = true;
  isDeleting = false;
  error = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.documentService.getMyDocument(id).subscribe({
      next: doc => {
        this.document = doc;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Document not found or you do not have access to it.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteDocument(): void {
    if (!this.document) return;
    if (!confirm('Delete this document? This cannot be undone.')) return;

    this.isDeleting = true;
    this.documentService.deleteDocument(this.document.id).subscribe({
      next: () => this.router.navigate(['/my-documents']),
      error: err => {
        this.error = err.error?.message || 'Failed to delete the document. Please try again.';
        this.isDeleting = false;
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
