import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VenueService } from '../../services/venue.service';
import { BookingService } from '../../services/booking.service';
import { PaymentRepository } from '../../repositories/payment.repository';
import { Venue } from '../../../shared/models/venue.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { AppValidators } from '../../../shared/utils/validators';
import { SlotService } from '../../services/slot.services';
import { TimeSlot } from '../../../shared/models/slot.model';
import { CreateBookingRequest, VerifyPaymentRequest } from '../../../shared/models/booking.model';
import { NotificationService } from '../../../shared/services/notification.service';
import { environment } from '../../../core/config/environment';

declare var Razorpay: any;

export interface Amenity {
  id: string;
  name: string;
  desc: string;
  price: number;
  icon: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent, CurrencyFormatPipe],
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
  private readonly paymentRepository = inject(PaymentRepository);
  private readonly slotService = inject(SlotService);
  private readonly notification = inject(NotificationService);

  readonly venue = signal<Venue | null>(null);
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly selectedSlotId = signal<number | null>(null);
  readonly selectedAmenityIds = signal<Set<string>>(new Set());
  readonly slots = signal<TimeSlot[]>([]);

  readonly amenities: Amenity[] = [
    { id: 'a1', name: 'Catering Service',    desc: 'Full catering for all guests (per head)', price: 500,  icon: 'M3 3h2l.4 2M7 13h10l4-4H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'a2', name: 'AV & Sound System',   desc: 'Professional PA, lighting & projector',   price: 3000, icon: 'M15.536 8.464a5 5 0 010 7.072M12 6a7 7 0 010 12M8.464 8.464a5 5 0 000 7.072M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'a3', name: 'Valet Parking',        desc: 'Dedicated parking for up to 100 cars',    price: 1500, icon: 'M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM3 4h13l4 4v4H3V4z' },
    { id: 'a4', name: 'Event Decoration',     desc: 'Floral & thematic decoration setup',      price: 8000, icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { id: 'a5', name: 'Security Team',        desc: '4 trained security personnel',            price: 2000, icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { id: 'a6', name: 'Photography Setup',    desc: 'Photo booth + candid photography',        price: 5000, icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  readonly form = this.fb.nonNullable.group({
    eventDate:  ['', [Validators.required, AppValidators.futureDate]],
    guestCount: ['', [Validators.required, Validators.min(1)]],
    notes:      [''],
  });

  readonly selectedSlot = computed(() => this.slots().find(s => s.id === this.selectedSlotId()) ?? null);
  readonly amenitiesTotal = computed(() => this.amenities.filter(a => this.selectedAmenityIds().has(a.id)).reduce((sum, a) => sum + a.price, 0));
  readonly slotTotal = computed(() => { const v = this.venue(); const slot = this.selectedSlot(); if (!v || !slot) return 0; return v.pricePerSlot + slot.surcharge; });
  readonly grandTotal = computed(() => this.slotTotal() + this.amenitiesTotal());
  readonly selectedAmenitiesList = computed(() => this.amenities.filter(a => this.selectedAmenityIds().has(a.id)));

  ngOnInit(): void {
    const venueId = this.route.snapshot.paramMap.get('venueId') ?? '';

    this.form.controls.eventDate.valueChanges.subscribe(date => {
      this.selectedSlotId.set(null);
      if (!date || this.form.controls.eventDate.invalid) { this.slots.set([]); return; }
      this.slotService.loadSlotsForVenue(venueId, date).subscribe({
        next: (slots) => this.slots.set(slots),
        error: () => this.slots.set([]),
      });
    });

    if (venueId) {
      this.venueService.loadVenueById(venueId).subscribe({
        next: (venue) => { this.venue.set(venue); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
    }
  }

  selectSlot(slot: TimeSlot): void { if (!slot.available) return; this.selectedSlotId.set(slot.id); }

  toggleAmenity(id: string): void {
    this.selectedAmenityIds.update(set => { const next = new Set(set); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }

  isAmenitySelected(id: string): boolean { return this.selectedAmenityIds().has(id); }

  onSubmit(): void {
    const selectedSlot = this.selectedSlot();
    if (!this.form.valid || !this.venue() || !selectedSlot) return;

    this.submitting.set(true);

    const payload: CreateBookingRequest = {
      venueId: this.venue()!.id,
      slotTemplateId: selectedSlot.id,
      bookingDate: this.form.value.eventDate!,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      guestCount: Number(this.form.value.guestCount),
      notes: this.form.value.notes,
    };

    this.bookingService.createBooking(payload).subscribe({
      next: (booking) => this.initiatePayment(booking.id, booking.totalAmount),
      error: () => { this.notification.error('Failed to create booking'); this.submitting.set(false); },
    });
  }

  private initiatePayment(bookingId: number, amount: number): void {
    this.paymentRepository.createPaymentOrder(bookingId).subscribe({
      next: (order) => {
        const options = {
          key: environment.razorpayKeyId,
          amount: order.amount * 100,
          currency: 'INR',
          order_id: order.razorpayOrderId,
          name: 'BookMyVenue',
          description: 'Venue Booking Payment',
          handler: (response: any) => this.verifyPayment(response),
          modal: { ondismiss: () => this.submitting.set(false) },
        };
        const rzp = new Razorpay(options);
        rzp.open();
      },
      error: () => { this.notification.error('Failed to initiate payment'); this.submitting.set(false); },
    });
  }

  private verifyPayment(response: any): void {
    const request: VerifyPaymentRequest = {
      razorpayOrderId:   response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id,
      razorpaySignature: response.razorpay_signature,
    };
    this.paymentRepository.verifyPayment(request).subscribe({
      next: () => { this.notification.success('Payment successful! Booking confirmed.'); this.router.navigate(['/user/my-bookings']); },
      error: () => { this.notification.error('Payment verification failed'); this.submitting.set(false); },
    });
  }
}
