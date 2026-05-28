import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VenueService } from '../../services/venue.service';
import { BookingService } from '../../services/booking.service';
import { Venue } from '../../../shared/models/venue.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { AppValidators } from '../../../shared/utils/validators';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent, LoaderComponent, CurrencyFormatPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly venueService = inject(VenueService);
  private readonly bookingService = inject(BookingService);

  readonly venue = signal<Venue | null>(null);
  readonly loading = signal(true);
  readonly submitting = signal(false);

  readonly form = this.fb.nonNullable.group({
    eventDate: ['', [Validators.required, AppValidators.futureDate]],
    startTime: ['', [Validators.required]],
    endTime: ['', [Validators.required]],
    guestCount: [1, [Validators.required, Validators.min(1)]],
    notes: [''],
  });

  readonly estimatedTotal = computed(() => {
    const v = this.venue();
    if (!v) return 0;
    return v.pricePerHour;
  });

  ngOnInit(): void {
    const venueId = this.route.snapshot.paramMap.get('venueId');
    if (venueId) {
      this.venueService.loadVenueById(venueId).subscribe({
        next: (venue) => {
          this.venue.set(venue);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid && this.venue()) {
      this.submitting.set(true);
      this.bookingService.createBooking({
        venueId: this.venue()!.id,
        ...this.form.getRawValue(),
        guestCount: Number(this.form.getRawValue().guestCount),
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
