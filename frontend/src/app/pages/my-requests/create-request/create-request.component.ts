import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RequestService } from '../../../services/request.service';

@Component({
  selector: 'app-create-request',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.css']
})
export class CreateRequestComponent {
  private readonly fb = inject(FormBuilder);
  private readonly requestService = inject(RequestService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.required, Validators.maxLength(2000)]]
  });

  isSubmitting = false;
  submitError = '';

  submit(): void {
    this.submitError = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    this.isSubmitting = true;

    this.requestService.createRequest({
      title: v.title ?? '',
      description: v.description ?? ''
    }).subscribe({
      next: () => this.router.navigate(['/my-requests']),
      error: err => {
        this.submitError = err.error?.message || 'Failed to submit request. Please try again.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }
}
