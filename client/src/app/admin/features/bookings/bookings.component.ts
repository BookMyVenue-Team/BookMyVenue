import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { Booking } from '../../../shared/models/booking.model';

@Component({
  selector: 'app-admin-bookings', standalone: true,
  imports: [LoaderComponent, EmptyStateComponent, PaginationComponent, DateFormatPipe, CurrencyFormatPipe],
  templateUrl: './bookings.component.html', styleUrl: './bookings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingsComponent {
  readonly bookings = signal<Booking[]>([]);
  readonly loading = signal(false);
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);
  onPageChange(page: number): void { this.currentPage.set(page); }
}
