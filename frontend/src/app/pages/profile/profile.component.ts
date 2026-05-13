import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { finalize } from 'rxjs';
import { ProfileService, UserProfile } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);
  private readonly cdr = inject(ChangeDetectorRef);

  profile: UserProfile | null = null;
  isLoading = true;
  isSaving = false;
  saveMessage = '';
  isSaveSuccess = false;
  loadError = '';

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

  editForm = this.fb.group({
    phoneCountryCode: ['+40', [Validators.required]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^[\d\s\-\(\)]{4,20}$/)]],
    street: ['', [Validators.required, Validators.maxLength(200)]],
    city: ['', [Validators.required, Validators.maxLength(100)]],
    postalCode: ['', [Validators.required, Validators.maxLength(20)]],
    country: ['Romania', [Validators.required]]
  });

  ngOnInit(): void {
    this.profileService.getProfile().pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: profile => {
        this.profile = profile;
        this.editForm.patchValue({
          phoneCountryCode: profile.phoneCountryCode || '+40',
          phoneNumber: profile.phoneNumber,
          street: profile.street,
          city: profile.city,
          postalCode: profile.postalCode,
          country: profile.country || 'Romania'
        });
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadError = 'Failed to load profile. Please refresh the page.';
        this.cdr.detectChanges();
      }
    });
  }

  get initials(): string {
    if (!this.profile) return '?';
    return `${this.profile.firstName.charAt(0)}${this.profile.lastName.charAt(0)}`.toUpperCase();
  }

  hasValidCreatedAt(): boolean {
    if (!this.profile) return false;
    return new Date(this.profile.createdAt).getFullYear() > 2000;
  }

  save(): void {
    this.saveMessage = '';
    this.isSaveSuccess = false;

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      this.saveMessage = 'Please fix the errors before saving.';
      return;
    }

    const v = this.editForm.getRawValue();
    this.isSaving = true;

    this.profileService.updateProfile({
      phoneCountryCode: v.phoneCountryCode ?? '',
      phoneNumber: v.phoneNumber ?? '',
      street: v.street ?? '',
      city: v.city ?? '',
      postalCode: v.postalCode ?? '',
      country: v.country ?? ''
    }).pipe(
      finalize(() => {
        this.isSaving = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: response => {
        this.isSaveSuccess = true;
        this.saveMessage = response.message;
        if (this.profile) {
          this.profile = {
            ...this.profile,
            phoneCountryCode: v.phoneCountryCode ?? '',
            phoneNumber: v.phoneNumber ?? '',
            street: v.street ?? '',
            city: v.city ?? '',
            postalCode: v.postalCode ?? '',
            country: v.country ?? ''
          };
        }
        this.cdr.detectChanges();
      },
      error: err => {
        this.isSaveSuccess = false;
        this.saveMessage = err.error?.message || 'Failed to save changes. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }
}
