import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, forkJoin, from, of } from 'rxjs';
import { ForumService } from '../../../services/forum.service';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

@Component({
  selector: 'app-create-thread',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './create-thread.component.html',
  styleUrls: ['./create-thread.component.css']
})
export class CreateThreadComponent {
  private readonly fb = inject(FormBuilder);
  private readonly forumService = inject(ForumService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  isSubmitting = false;
  message = '';
  isSuccess = false;
  selectedFiles: File[] = [];
  fileError = '';

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
    content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10000)]]
  });

  get charCount(): number {
    return this.form.controls.content.value?.length ?? 0;
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fileError = '';
    const raw = Array.from(input.files ?? []);

    const invalid = raw.find(f => !ALLOWED_TYPES.includes(f.type) || f.size > MAX_SIZE_BYTES);
    if (invalid) {
      this.fileError = invalid.size > MAX_SIZE_BYTES
        ? `"${invalid.name}" exceeds the 5 MB limit.`
        : `"${invalid.name}" is not an allowed image type.`;
      input.value = '';
      return;
    }

    this.selectedFiles = [...this.selectedFiles, ...raw];
    input.value = '';
    this.cdr.detectChanges();
  }

  removeFile(index: number): void {
    this.selectedFiles = this.selectedFiles.filter((_, i) => i !== index);
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  submit(): void {
    this.message = '';
    this.isSuccess = false;
    this.fileError = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      if (this.form.controls.title.invalid) {
        this.message = 'Title must be between 5 and 200 characters.';
      } else {
        this.message = 'Content must be at least 10 characters.';
      }
      return;
    }

    const { title, content } = this.form.getRawValue();
    this.isSubmitting = true;

    this.forumService.createThread({ title: title!, content: content! }).pipe(
      finalize(() => {
        if (!this.isSuccess) {
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }
      })
    ).subscribe({
      next: thread => {
        if (this.selectedFiles.length === 0) {
          this.router.navigate(['/forum/thread', thread.id]);
          return;
        }

        const uploads$ = this.selectedFiles.map(f =>
          this.forumService.uploadThreadAttachment(thread.id, f)
        );

        forkJoin(uploads$).pipe(
          finalize(() => {
            this.isSubmitting = false;
            this.cdr.detectChanges();
          })
        ).subscribe({
          next: () => this.router.navigate(['/forum/thread', thread.id]),
          error: () => {
            this.router.navigate(['/forum/thread', thread.id]);
          }
        });
      },
      error: err => {
        this.message = err.error?.message || 'Failed to create thread. Please try again.';
        this.isSuccess = false;
        this.cdr.detectChanges();
      }
    });
  }
}
