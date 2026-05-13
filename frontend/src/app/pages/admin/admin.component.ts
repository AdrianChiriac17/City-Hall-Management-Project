import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AdminService, AdminUser } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly cdr = inject(ChangeDetectorRef);

  users: AdminUser[] = [];
  availableRoles: string[] = [];
  isLoading = true;
  error = '';

  // Track the role being edited per user: userId → selected role string
  pendingRole: Record<string, string> = {};
  savingUserId: string | null = null;
  saveMessage: Record<string, string> = {};

  ngOnInit(): void {
    this.adminService.getUsers().subscribe({
      next: users => {
        this.users = users;
        users.forEach(u => this.pendingRole[u.id] = u.roles[0] ?? '');
        this.loadRoles();
      },
      error: () => {
        this.error = 'Failed to load users.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadRoles(): void {
    this.adminService.getRoles().subscribe({
      next: roles => {
        this.availableRoles = roles;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  saveRole(user: AdminUser): void {
    const role = this.pendingRole[user.id];
    const roles = role ? [role] : [];
    this.savingUserId = user.id;
    this.saveMessage[user.id] = '';

    this.adminService.updateUserRoles(user.id, roles).subscribe({
      next: updated => {
        const idx = this.users.findIndex(u => u.id === updated.id);
        if (idx !== -1) this.users[idx] = updated;
        this.pendingRole[updated.id] = updated.roles[0] ?? '';
        this.savingUserId = null;
        this.saveMessage[user.id] = 'Saved';
        this.cdr.detectChanges();
        setTimeout(() => { this.saveMessage[user.id] = ''; this.cdr.detectChanges(); }, 2500);
      },
      error: () => {
        this.savingUserId = null;
        this.saveMessage[user.id] = 'Error';
        this.cdr.detectChanges();
      }
    });
  }

  initials(user: AdminUser): string {
    return `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();
  }

  roleColor(role: string): string {
    const map: Record<string, string> = {
      'System Administrator': '#c0392b',
      'Department Manager':   '#8e44ad',
      'Employee':             '#2980b9',
      'Forum Administrator':  '#16a085',
      'Citizen':              '#7f8c8d'
    };
    return map[role] ?? '#7f8c8d';
  }
}