import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export function roleGuard(allowedRoles: string[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const check = (roles: string[]) => {
      const hasRole = roles.some(r => allowedRoles.includes(r));
      if (hasRole) return true;
      router.navigate(['/']);
      return false;
    };

    const user = authService.currentUser;
    if (user) return check(user.roles);

    return authService.loadCurrentUser().pipe(
      map(u => check(u.roles)),
      catchError(() => { router.navigate(['/login']); return of(false); })
    );
  };
}