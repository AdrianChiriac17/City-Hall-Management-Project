import { Component, afterNextRender, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isMenuOpen = false;

  readonly currentUser = toSignal(this.authService.currentUser$, { initialValue: null });

  constructor() {
    afterNextRender(() => {
      this.authService.loadCurrentUser().subscribe({
        error: () => this.authService.clearCurrentUser()
      });
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.closeMenu();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.authService.clearCurrentUser();
        this.closeMenu();
        this.router.navigate(['/login']);
      }
    });
  }
}
