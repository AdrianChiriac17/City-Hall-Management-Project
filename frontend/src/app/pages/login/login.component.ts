import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  showPassword = false;
  isSubmitting = false;
  message = '';
  isSuccess = false;

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  submit(): void {
    this.message = '';
    this.isSuccess = false;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.message = 'Please enter a valid email and password.';
      return;
    }

    const formValue = this.loginForm.getRawValue();
    this.isSubmitting = true;
    this.authService.login({
      email: formValue.email ?? '',
      password: formValue.password ?? ''
    }).pipe(
      switchMap(response => {
        this.isSuccess = response.success;
        this.message = response.message || 'Login successful.';
        return this.authService.loadCurrentUser();
      }),
      finalize(() => {
        this.isSubmitting = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: () => {
        setTimeout(() => this.router.navigate(['/']), 500);
      },
      error: error => {
        this.message = error.error?.message || 'Login failed. Please check your credentials.';
        this.isSuccess = false;
        this.cdr.detectChanges();
      }
    });
  }
}
