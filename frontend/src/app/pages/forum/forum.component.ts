import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ForumService, ForumThreadListItem, PagedResult } from '../../services/forum.service';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  private readonly forumService = inject(ForumService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  result: PagedResult<ForumThreadListItem> | null = null;
  isLoading = true;
  error = '';
  page = 1;
  readonly pageSize = 20;

  ngOnInit(): void {
    this.loadThreads();
  }

  loadThreads(): void {
    this.isLoading = true;
    this.error = '';

    this.forumService.getThreads(this.page, this.pageSize).subscribe({
      next: result => {
        this.result = result;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load forum threads. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  changePage(newPage: number): void {
    this.page = newPage;
    this.loadThreads();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openThread(id: string): void {
    this.router.navigate(['/forum/thread', id]);
  }

  formatReplyCount(count: number): string {
    return count === 1 ? '1 reply' : `${count} replies`;
  }
}
