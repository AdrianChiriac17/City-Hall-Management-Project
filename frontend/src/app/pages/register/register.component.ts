import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  showPassword = false;
  showConfirmPassword = false;
  isSubmitting = false;
  message = '';
  isSuccess = false;

  registerForm = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.maxLength(80)]],
    lastName: ['', [Validators.required, Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    ]],
    confirmPassword: ['', [Validators.required]]
  });

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  submit(): void {
    this.message = '';
    this.isSuccess = false;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.message = this.getValidationMessage();
      return;
    }

    const formValue = this.registerForm.getRawValue();
    if (formValue.password !== formValue.confirmPassword) {
      this.message = 'Password and confirm password do not match.';
      return;
    }

    this.isSubmitting = true;
    this.authService.register({
      firstName: formValue.firstName ?? '',
      lastName: formValue.lastName ?? '',
      email: formValue.email ?? '',
      password: formValue.password ?? '',
      confirmPassword: formValue.confirmPassword ?? ''
    }).pipe(
      finalize(() => {
        this.isSubmitting = false;
      })
    ).subscribe({
      next: response => {
        this.isSuccess = response.success;
        this.message = response.message || 'Account created successfully.';
        this.registerForm.reset();
        setTimeout(() => this.router.navigate(['/login']), 700);
      },
      error: error => {
        this.message = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  private getValidationMessage(): string {
    if (this.registerForm.controls.firstName.invalid || this.registerForm.controls.lastName.invalid) {
      return 'Please enter both your first name and last name.';
    }

    if (this.registerForm.controls.email.invalid) {
      return 'Please enter a valid email address.';
    }

    if (this.registerForm.controls.password.invalid) {
      return 'Password must be at least 8 characters and include uppercase, lowercase, and a number.';
    }

    return 'Please complete all fields with valid information.';
  }
}
