import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VenueService } from '../../services/venue.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-edit-venue',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent, LoaderComponent],
  templateUrl: './edit-venue.component.html',
  styleUrl: './edit-venue.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditVenueComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly venueService = inject(VenueService);

  readonly loading = signal(true);
  readonly saving = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    address: ['', [Validators.required]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    zipCode: ['', [Validators.required]],
    capacity: [0, [Validators.required, Validators.min(1)]],
    pricePerHour: [0, [Validators.required, Validators.min(1)]],
    pricePerDay: [0, [Validators.required, Validators.min(1)]],
    amenities: [''],
  });

  private venueId = '';

  ngOnInit(): void {
    this.venueId = this.route.snapshot.paramMap.get('id') || '';
    if (this.venueId) {
      this.venueService.loadVenueById(this.venueId).subscribe({
        next: (venue) => {
          this.form.patchValue({
            ...venue,
            amenities: venue.amenities.join(', '),
          });
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.saving.set(true);
      const raw = this.form.getRawValue();
      this.venueService.updateVenue(this.venueId, {
        ...raw,
        amenities: raw.amenities.split(',').map(a => a.trim()).filter(Boolean),
      }).subscribe({
        next: () => {
          this.saving.set(false);
          this.router.navigate(['/vendor/venues']);
        },
        error: () => this.saving.set(false),
      });
    }
  }
}
