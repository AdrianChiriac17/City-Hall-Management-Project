import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DocumentService, DocumentDetail } from '../../../services/document.service';

@Component({
  selector: 'app-document-approval',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './document-approval.component.html',
  styleUrls: ['./document-approval.component.css']
})
export class DocumentApprovalComponent implements OnInit {
  private readonly documentService = inject(DocumentService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  documents: DocumentDetail[] = [];
  isLoading = true;
  error = '';

  ngOnInit(): void {
    this.documentService.getPendingDocuments().subscribe({
      next: docs => {
        this.documents = docs;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load pending documents. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  reviewDocument(id: string): void {
    this.router.navigate(['/admin/documents-approval', id]);
  }
}
