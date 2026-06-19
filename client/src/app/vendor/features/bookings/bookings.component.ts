import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { BookingStatus } from '../../../shared/enums/booking-status.enum';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-vendor-bookings',
  standalone: true,
  imports: [LoaderComponent, EmptyStateComponent, DateFormatPipe, CurrencyFormatPipe],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingsComponent implements OnInit {
  private readonly bookingService = inject(BookingService);
  readonly bookings = this.bookingService.bookings;
  readonly loading = this.bookingService.loading;
  readonly BookingStatus = BookingStatus;

  ngOnInit(): void { this.bookingService.loadVendorBookings(); }

  onApprove(id: number): void { this.bookingService.updateBookingStatus(id, 'confirmed'); }
  onReject(id: number): void { this.bookingService.updateBookingStatus(id, 'rejected'); }
}