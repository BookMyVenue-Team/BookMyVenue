import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { BookingStatus } from '../../../shared/enums/booking-status.enum';
import { TableColumn } from '../../../shared/components/table/table.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [LoaderComponent, EmptyStateComponent, DateFormatPipe, CurrencyFormatPipe],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyBookingsComponent implements OnInit {
  private readonly bookingService = inject(BookingService);

  readonly bookings = this.bookingService.bookings;
  readonly loading = this.bookingService.loading;

  readonly columns: TableColumn[] = [
    { key: 'venueName', label: 'Venue', sortable: true },
    { key: 'eventDate', label: 'Date', sortable: true },
    { key: 'startTime', label: 'Time' },
    { key: 'guestCount', label: 'Guests' },
    { key: 'totalAmount', label: 'Amount', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
  ];

  ngOnInit(): void {
    this.bookingService.loadUserBookings();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case BookingStatus.Confirmed: return 'bg-green-100 text-green-700';
      case BookingStatus.Pending: return 'bg-yellow-100 text-yellow-700';
      case BookingStatus.Cancelled: return 'bg-red-100 text-red-700';
      case BookingStatus.Completed: return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}
