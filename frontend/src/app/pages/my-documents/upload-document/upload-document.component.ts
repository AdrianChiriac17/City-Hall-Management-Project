import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DocumentService } from '../../../services/document.service';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg'
];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

@Component({
  selector: 'app-upload-document',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.css']
})
export class UploadDocumentComponent {
  private readonly fb = inject(FormBuilder);
  private readonly documentService = inject(DocumentService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.maxLength(1000)]]
  });

  selectedFile: File | null = null;
  fileError = '';
  submitError = '';
  isSubmitting = false;

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.fileError = '';
    this.selectedFile = null;

    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      this.fileError = 'Only PDF, DOC, DOCX, PNG, and JPG files are allowed.';
      input.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      this.fileError = 'File size must not exceed 10 MB.';
      input.value = '';
      return;
    }

    this.selectedFile = file;
    this.cdr.detectChanges();
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  submit(): void {
    this.submitError = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.selectedFile) {
      this.fileError = 'Please select a file to upload.';
      return;
    }

    const v = this.form.getRawValue();
    const formData = new FormData();
    formData.append('title', v.title ?? '');
    if (v.description) formData.append('description', v.description);
    formData.append('file', this.selectedFile, this.selectedFile.name);

    this.isSubmitting = true;
    this.documentService.uploadDocument(formData).subscribe({
      next: () => this.router.navigate(['/my-documents']),
      error: err => {
        this.submitError = err.error?.message || 'Upload failed. Please try again.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }
}
