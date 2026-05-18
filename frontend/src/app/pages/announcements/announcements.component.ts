import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Announcement, AnnouncementService, AnnouncementsPage } from '../../services/announcement.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css']
})
export class AnnouncementsComponent implements OnInit {
  private readonly service = inject(AnnouncementService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  result: AnnouncementsPage | null = null;
  isLoading = true;
  error = '';

  searchInput = '';
  activeSearch = '';
  importantOnly = false;
  page = 1;

  showForm = false;
  submitting = false;
  formError = '';
  newTitle = '';
  newContent = '';
  newIsImportant = false;

  editingId: string | null = null;
  editTitle = '';
  editContent = '';
  editIsImportant = false;
  editSaving = false;
  editError = '';

  get currentUserId(): string {
    return this.authService.currentUser?.id as unknown as string ?? '';
  }

  get isStaff(): boolean {
    const roles = this.authService.currentUser?.roles ?? [];
    return roles.some(r => ['Employee', 'Department Manager', 'System Administrator'].includes(r));
  }

  get isAdmin(): boolean {
    return this.authService.currentUser?.roles?.includes('System Administrator') ?? false;
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.error = '';
    this.service.getAll(this.page, 20, this.activeSearch, this.importantOnly).subscribe({
      next: res => {
        this.result = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load announcements. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  search(): void {
    this.activeSearch = this.searchInput.trim();
    this.page = 1;
    this.load();
  }

  clearSearch(): void {
    this.searchInput = '';
    this.activeSearch = '';
    this.page = 1;
    this.load();
  }

  toggleImportant(): void {
    this.importantOnly = !this.importantOnly;
    this.page = 1;
    this.load();
  }

  changePage(p: number): void {
    this.page = p;
    this.load();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.newTitle = '';
      this.newContent = '';
      this.newIsImportant = false;
      this.formError = '';
    }
  }

  submit(): void {
    if (!this.newTitle.trim() || !this.newContent.trim()) return;
    this.submitting = true;
    this.formError = '';
    this.service.create({ title: this.newTitle.trim(), content: this.newContent.trim(), isImportant: this.newIsImportant }).subscribe({
      next: () => {
        this.submitting = false;
        this.showForm = false;
        this.newTitle = '';
        this.newContent = '';
        this.newIsImportant = false;
        this.page = 1;
        this.load();
      },
      error: () => {
        this.formError = 'Failed to publish announcement.';
        this.submitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  startEdit(a: Announcement): void {
    this.editingId = a.id;
    this.editTitle = a.title;
    this.editContent = a.content;
    this.editIsImportant = a.isImportant;
    this.editError = '';
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editError = '';
  }

  saveEdit(): void {
    if (!this.editingId) return;
    this.editSaving = true;
    this.editError = '';
    this.service.update(this.editingId, { title: this.editTitle.trim(), content: this.editContent.trim(), isImportant: this.editIsImportant }).subscribe({
      next: () => {
        this.editSaving = false;
        this.editingId = null;
        this.load();
      },
      error: () => {
        this.editError = 'Failed to save changes.';
        this.editSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  delete(id: string): void {
    if (!confirm('Delete this announcement?')) return;
    this.service.delete(id).subscribe({
      next: () => this.load(),
      error: () => alert('Failed to delete announcement.')
    });
  }

  copyLink(id: string): void {
    const url = `${window.location.origin}/announcements/${id}`;
    navigator.clipboard.writeText(url).then(() => alert('Link copied to clipboard!'));
  }

  canEdit(a: Announcement): boolean {
    return a.authorUserId === this.currentUserId || this.isAdmin;
  }
}
