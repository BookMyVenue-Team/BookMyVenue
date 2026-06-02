import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VenueService } from '../../services/venue.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';

@Component({
  selector: 'app-create-venue',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './create-venue.component.html',
  styleUrl: './create-venue.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateVenueComponent {
  private readonly fb = inject(FormBuilder);
  private readonly venueService = inject(VenueService);
  readonly router = inject(Router);

  readonly saving = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    address: ['', [Validators.required]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    zipCode: ['', [Validators.required]],
    capacity: [0, [Validators.required, Validators.min(1)]],
    pricePerHour: [0, [Validators.required, Validators.min(1)]],
    pricePerDay: [0, [Validators.required, Validators.min(1)]],
    amenities: [''],
  });

  onSubmit(): void {
    if (this.form.valid) {
      this.saving.set(true);
      const raw = this.form.getRawValue();
      this.venueService.createVenue({
        ...raw,
        amenities: raw.amenities.split(',').map(a => a.trim()).filter(Boolean),
        images: [],
      }).subscribe({
        next: () => {
          this.saving.set(false);
          this.router.navigate(['/vendor/venues']);
        },
        error: () => this.saving.set(false),
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
