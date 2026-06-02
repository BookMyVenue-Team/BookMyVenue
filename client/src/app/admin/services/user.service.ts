import { Injectable, inject, signal } from '@angular/core';
import { AdminUserRepository } from '../repositories/user.repository';
import { User } from '../../shared/models/user.model';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable({ providedIn: 'root' })
export class AdminUserService {
  private readonly userRepository = inject(AdminUserRepository);
  private readonly notification = inject(NotificationService);

  readonly users = signal<User[]>([]);
  readonly loading = signal(false);
  readonly totalPages = signal(1);

  loadUsers(page = 1): void {
    this.loading.set(true);
    this.userRepository.getUsers(page).subscribe({
      next: (r) => { this.users.set(r.data); this.totalPages.set(r.totalPages); this.loading.set(false); },
      error: () => { this.notification.error('Failed to load users'); this.loading.set(false); },
    });
  }
}
