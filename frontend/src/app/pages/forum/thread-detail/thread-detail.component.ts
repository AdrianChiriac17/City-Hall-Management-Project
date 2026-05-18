import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { finalize, forkJoin } from 'rxjs';
import { ForumService, ForumThreadDetail, ForumPost } from '../../../services/forum.service';
import { AuthService } from '../../../services/auth.service';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

@Component({
  selector: 'app-thread-detail',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink, DatePipe],
  templateUrl: './thread-detail.component.html',
  styleUrls: ['./thread-detail.component.css']
})
export class ThreadDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly forumService = inject(ForumService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  thread: ForumThreadDetail | null = null;
  isLoading = true;
  error = '';

  replyForm = this.fb.group({
    content: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10000)]]
  });

  isSubmitting = false;
  replyMessage = '';
  replyIsSuccess = false;
  selectedFiles: File[] = [];
  fileError = '';

  // Thread editing
  isEditingThread = false;
  editThreadTitle = '';
  editThreadContent = '';
  editThreadSaving = false;
  editThreadError = '';

  // Post editing
  editingPostId: string | null = null;
  editPostContent: Record<string, string> = {};
  editPostSaving = false;
  editPostError = '';

  get currentUserId(): string | null {
    const user = this.authService.currentUser;
    return user ? String(user.id) : null;
  }

  get isModerator(): boolean {
    const roles = this.authService.currentUser?.roles ?? [];
    return roles.includes('Forum Administrator') || roles.includes('System Administrator');
  }

  get charCount(): number {
    return this.replyForm.controls.content.value?.length ?? 0;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/forum']); return; }
    this.loadThread(id);
  }

  loadThread(id: string): void {
    this.isLoading = true;
    this.error = '';
    this.forumService.getThread(id).subscribe({
      next: thread => {
        this.thread = thread;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load thread. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  retry(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadThread(id);
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

  initials(name: string): string {
    return name.split(' ').map(w => w[0] ?? '').join('').toUpperCase().slice(0, 2);
  }

  submitReply(): void {
    this.replyMessage = '';
    this.replyIsSuccess = false;
    this.fileError = '';

    if (this.replyForm.invalid) {
      this.replyForm.markAllAsTouched();
      this.replyMessage = 'Reply cannot be empty.';
      return;
    }

    if (!this.thread) return;

    const content = this.replyForm.controls.content.value!;
    this.isSubmitting = true;

    this.forumService.createPost(this.thread.id, { content }).pipe(
      finalize(() => {
        if (!this.replyIsSuccess) {
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }
      })
    ).subscribe({
      next: post => {
        if (this.selectedFiles.length === 0) {
          this.onReplySuccess(post);
          return;
        }

        const uploads$ = this.selectedFiles.map(f =>
          this.forumService.uploadPostAttachment(post.id, f)
        );

        forkJoin(uploads$).pipe(
          finalize(() => {
            this.isSubmitting = false;
            this.cdr.detectChanges();
          })
        ).subscribe({
          next: attachments => {
            post.attachments = attachments;
            this.onReplySuccess(post);
          },
          error: () => this.onReplySuccess(post)
        });
      },
      error: err => {
        this.replyMessage = err.error?.message || 'Failed to post reply. Please try again.';
        this.replyIsSuccess = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleClose(): void {
    if (!this.thread) return;
    this.forumService.toggleThreadClosed(this.thread.id).subscribe({
      next: ({ isClosed }) => {
        this.thread!.isClosed = isClosed;
        this.cdr.detectChanges();
      }
    });
  }

  deleteThread(): void {
    if (!this.thread || !confirm('Delete this entire thread? This cannot be undone.')) return;
    this.forumService.deleteThread(this.thread.id).subscribe({
      next: () => this.router.navigate(['/forum'])
    });
  }

  deletePost(postId: string): void {
    if (!confirm('Delete this reply? This cannot be undone.')) return;
    this.forumService.deletePost(postId).subscribe({
      next: () => {
        this.thread!.posts = this.thread!.posts.filter(p => p.id !== postId);
        this.cdr.detectChanges();
      }
    });
  }

  startEditThread(): void {
    if (!this.thread) return;
    this.editThreadTitle = this.thread.title;
    this.editThreadContent = this.thread.content;
    this.editThreadError = '';
    this.isEditingThread = true;
  }

  cancelEditThread(): void {
    this.isEditingThread = false;
    this.editThreadError = '';
  }

  saveEditThread(): void {
    if (!this.thread) return;
    const title = this.editThreadTitle.trim();
    const content = this.editThreadContent.trim();
    if (!title || !content) { this.editThreadError = 'Title and content are required.'; return; }

    this.editThreadSaving = true;
    this.editThreadError = '';

    this.forumService.updateThread(this.thread.id, { title, content }).subscribe({
      next: updated => {
        this.thread!.title = updated.title;
        this.thread!.content = updated.content;
        this.thread!.updatedAt = updated.updatedAt;
        this.isEditingThread = false;
        this.editThreadSaving = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.editThreadError = 'Failed to save changes. Please try again.';
        this.editThreadSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  startEditPost(post: ForumPost): void {
    this.editingPostId = post.id;
    this.editPostContent[post.id] = post.content;
    this.editPostError = '';
  }

  cancelEditPost(): void {
    this.editingPostId = null;
    this.editPostError = '';
  }

  saveEditPost(post: ForumPost): void {
    const content = (this.editPostContent[post.id] ?? '').trim();
    if (!content) { this.editPostError = 'Reply cannot be empty.'; return; }

    this.editPostSaving = true;
    this.editPostError = '';

    this.forumService.updatePost(post.id, { content }).subscribe({
      next: updated => {
        post.content = updated.content;
        post.updatedAt = updated.updatedAt;
        this.editingPostId = null;
        this.editPostSaving = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.editPostError = 'Failed to save changes. Please try again.';
        this.editPostSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  private onReplySuccess(post: ForumPost): void {
    this.replyIsSuccess = true;
    this.isSubmitting = false;
    this.replyForm.reset();
    this.selectedFiles = [];
    this.thread!.posts = [...this.thread!.posts, post];
    this.cdr.detectChanges();

    setTimeout(() => {
      this.replyMessage = '';
      this.replyIsSuccess = false;
      this.cdr.detectChanges();
    }, 3000);
  }
}
