import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { Vendor } from '../../../shared/models/vendor.model';

@Component({
  selector: 'app-admin-vendors', standalone: true,
  imports: [LoaderComponent, EmptyStateComponent, PaginationComponent],
  templateUrl: './vendors.component.html', styleUrl: './vendors.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorsComponent {
  readonly vendors = signal<Vendor[]>([]);
  readonly loading = signal(false);
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);
  onPageChange(page: number): void { this.currentPage.set(page); }
}
