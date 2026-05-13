import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DocumentService, DocumentSummary } from '../../services/document.service';

@Component({
  selector: 'app-my-documents',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './my-documents.component.html',
  styleUrls: ['./my-documents.component.css']
})
export class MyDocumentsComponent implements OnInit {
  private readonly documentService = inject(DocumentService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  documents: DocumentSummary[] = [];
  isLoading = true;
  error = '';

  ngOnInit(): void {
    this.documentService.getMyDocuments().subscribe({
      next: docs => {
        this.documents = docs;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load documents. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openDocument(id: string): void {
    this.router.navigate(['/my-documents', id]);
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
