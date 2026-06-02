import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-admin-users', standalone: true,
  imports: [LoaderComponent, EmptyStateComponent, PaginationComponent],
  templateUrl: './users.component.html', styleUrl: './users.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  readonly users = signal<User[]>([]);
  readonly loading = signal(false);
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);

  onPageChange(page: number): void { this.currentPage.set(page); }
}
