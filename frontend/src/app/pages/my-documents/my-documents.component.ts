import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentService, DocumentSummary } from '../../services/document.service';

@Component({
  selector: 'app-my-documents',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule],
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

  searchInput = '';

  get filteredDocuments(): DocumentSummary[] {
    const term = this.searchInput.trim().toLowerCase();
    if (!term) return this.documents;
    return this.documents.filter(d =>
      d.title.toLowerCase().includes(term) ||
      d.originalFileName.toLowerCase().includes(term)
    );
  }

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

  clearSearch(): void {
    this.searchInput = '';
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
