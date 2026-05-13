import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  showPassword = false;
  showConfirmPassword = false;
  isSubmitting = false;
  message = '';
  isSuccess = false;

  readonly countryCodes = [
    { dial: '+40', name: 'Romania' },
    { dial: '+355', name: 'Albania' },
    { dial: '+376', name: 'Andorra' },
    { dial: '+374', name: 'Armenia' },
    { dial: '+43', name: 'Austria' },
    { dial: '+994', name: 'Azerbaijan' },
    { dial: '+375', name: 'Belarus' },
    { dial: '+32', name: 'Belgium' },
    { dial: '+387', name: 'Bosnia and Herzegovina' },
    { dial: '+359', name: 'Bulgaria' },
    { dial: '+55', name: 'Brazil' },
    { dial: '+1', name: 'Canada' },
    { dial: '+86', name: 'China' },
    { dial: '+385', name: 'Croatia' },
    { dial: '+357', name: 'Cyprus' },
    { dial: '+420', name: 'Czech Republic' },
    { dial: '+45', name: 'Denmark' },
    { dial: '+20', name: 'Egypt' },
    { dial: '+372', name: 'Estonia' },
    { dial: '+358', name: 'Finland' },
    { dial: '+33', name: 'France' },
    { dial: '+995', name: 'Georgia' },
    { dial: '+49', name: 'Germany' },
    { dial: '+30', name: 'Greece' },
    { dial: '+36', name: 'Hungary' },
    { dial: '+91', name: 'India' },
    { dial: '+62', name: 'Indonesia' },
    { dial: '+353', name: 'Ireland' },
    { dial: '+972', name: 'Israel' },
    { dial: '+39', name: 'Italy' },
    { dial: '+81', name: 'Japan' },
    { dial: '+962', name: 'Jordan' },
    { dial: '+7', name: 'Kazakhstan' },
    { dial: '+254', name: 'Kenya' },
    { dial: '+82', name: 'South Korea' },
    { dial: '+371', name: 'Latvia' },
    { dial: '+370', name: 'Lithuania' },
    { dial: '+352', name: 'Luxembourg' },
    { dial: '+356', name: 'Malta' },
    { dial: '+52', name: 'Mexico' },
    { dial: '+373', name: 'Moldova' },
    { dial: '+382', name: 'Montenegro' },
    { dial: '+212', name: 'Morocco' },
    { dial: '+31', name: 'Netherlands' },
    { dial: '+64', name: 'New Zealand' },
    { dial: '+234', name: 'Nigeria' },
    { dial: '+389', name: 'North Macedonia' },
    { dial: '+47', name: 'Norway' },
    { dial: '+92', name: 'Pakistan' },
    { dial: '+63', name: 'Philippines' },
    { dial: '+48', name: 'Poland' },
    { dial: '+351', name: 'Portugal' },
    { dial: '+7', name: 'Russia' },
    { dial: '+966', name: 'Saudi Arabia' },
    { dial: '+381', name: 'Serbia' },
    { dial: '+65', name: 'Singapore' },
    { dial: '+421', name: 'Slovakia' },
    { dial: '+386', name: 'Slovenia' },
    { dial: '+27', name: 'South Africa' },
    { dial: '+34', name: 'Spain' },
    { dial: '+46', name: 'Sweden' },
    { dial: '+41', name: 'Switzerland' },
    { dial: '+66', name: 'Thailand' },
    { dial: '+216', name: 'Tunisia' },
    { dial: '+90', name: 'Turkey' },
    { dial: '+380', name: 'Ukraine' },
    { dial: '+971', name: 'United Arab Emirates' },
    { dial: '+44', name: 'United Kingdom' },
    { dial: '+1', name: 'United States' },
    { dial: '+598', name: 'Uruguay' },
    { dial: '+58', name: 'Venezuela' },
    { dial: '+84', name: 'Vietnam' },
  ];

  readonly countries = [
    'Romania',
    'Albania', 'Andorra', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
    'Belarus', 'Belgium', 'Bolivia', 'Bosnia and Herzegovina', 'Brazil', 'Bulgaria',
    'Canada', 'Chile', 'China', 'Colombia', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
    'Denmark', 'Ecuador', 'Egypt', 'Estonia',
    'Finland', 'France',
    'Georgia', 'Germany', 'Greece',
    'Hungary', 'Iceland', 'India', 'Indonesia', 'Ireland', 'Israel', 'Italy',
    'Japan', 'Jordan',
    'Kazakhstan', 'Kenya', 'Kosovo',
    'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg',
    'Malaysia', 'Malta', 'Mexico', 'Moldova', 'Monaco', 'Montenegro', 'Morocco',
    'Netherlands', 'New Zealand', 'Nigeria', 'North Macedonia', 'Norway',
    'Pakistan', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
    'Russia',
    'San Marino', 'Saudi Arabia', 'Serbia', 'Singapore', 'Slovakia', 'Slovenia',
    'South Africa', 'South Korea', 'Spain', 'Sweden', 'Switzerland',
    'Tanzania', 'Thailand', 'Tunisia', 'Turkey',
    'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay',
    'Vatican City', 'Venezuela', 'Vietnam',
  ];

  registerForm = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.maxLength(80)]],
    lastName: ['', [Validators.required, Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email]],
    phoneCountryCode: ['+40', [Validators.required]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^[\d\s\-\(\)]{4,20}$/)]],
    street: ['', [Validators.required, Validators.maxLength(200)]],
    city: ['', [Validators.required, Validators.maxLength(100)]],
    postalCode: ['', [Validators.required, Validators.maxLength(20)]],
    country: ['Romania', [Validators.required]],
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
      confirmPassword: formValue.confirmPassword ?? '',
      phoneCountryCode: formValue.phoneCountryCode ?? '',
      phoneNumber: formValue.phoneNumber ?? '',
      street: formValue.street ?? '',
      city: formValue.city ?? '',
      postalCode: formValue.postalCode ?? '',
      country: formValue.country ?? ''
    }).pipe(
      finalize(() => {
        this.isSubmitting = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: response => {
        this.isSuccess = response.success;
        this.message = response.message || 'Account created successfully.';
        this.registerForm.reset({ phoneCountryCode: '+40', country: 'Romania' });
        setTimeout(() => this.router.navigate(['/login']), 700);
        this.cdr.detectChanges();
      },
      error: error => {
        this.message = error.error?.message || 'Registration failed. Please try again.';
        this.isSuccess = false;
        this.cdr.detectChanges();
      }
    });
  }

  private getValidationMessage(): string {
    const c = this.registerForm.controls;

    if (c.firstName.invalid || c.lastName.invalid) {
      return 'Please enter your first and last name.';
    }
    if (c.email.invalid) {
      return 'Please enter a valid email address.';
    }
    if (c.phoneCountryCode.invalid || c.phoneNumber.invalid) {
      return 'Please enter a valid phone number (digits, spaces, dashes and parentheses only, 4–20 characters).';
    }
    if (c.street.invalid) {
      return 'Please enter your street address.';
    }
    if (c.city.invalid) {
      return 'Please enter your city.';
    }
    if (c.postalCode.invalid) {
      return 'Please enter your postal code.';
    }
    if (c.country.invalid) {
      return 'Please select your country.';
    }
    if (c.password.invalid) {
      return 'Password must be at least 8 characters and include uppercase, lowercase, and a number.';
    }
    return 'Please complete all fields with valid information.';
  }
}
