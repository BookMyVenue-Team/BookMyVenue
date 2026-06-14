import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VenueService } from '../../services/venue.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CloudinaryService } from '../../../shared/services/cloudinary.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { forkJoin } from 'rxjs';

export interface VenueCategory { id: number; name: string; }
export interface VenueAmenity  { id: string; name: string; desc: string; icon: string; }

@Component({
  selector: 'app-create-venue',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './create-venue.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateVenueComponent {
  private readonly fb           = inject(FormBuilder);
  private readonly venueService = inject(VenueService);
  private readonly cloudinary   = inject(CloudinaryService);
  private readonly notification = inject(NotificationService);
  readonly router               = inject(Router);

  readonly saving    = signal(false);
  readonly uploading = signal(false);
  readonly imageUrls = signal<string[]>([]);
  readonly selectedAmenities = signal<Set<string>>(new Set());
  readonly dragOver  = signal(false);

  readonly categories: VenueCategory[] = [
    { id: 1, name: 'Banquet Hall' },
    { id: 2, name: 'Rooftop' },
    { id: 3, name: 'Outdoor / Garden' },
    { id: 4, name: 'Heritage' },
    { id: 5, name: 'Conference Centre' },
    { id: 6, name: 'Resort' },
    { id: 7, name: 'Club House' },
    { id: 8, name: 'Hotel Ballroom' },
  ];

  readonly amenitiesList: VenueAmenity[] = [
    { id: 'catering',     name: 'Catering Service',   desc: 'In-house food & beverage',           icon: 'M3 3h2l.4 2M7 13h10l4-4H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'av',           name: 'AV & Sound System',  desc: 'PA system, projector & lighting',     icon: 'M15.536 8.464a5 5 0 010 7.072M12 6a7 7 0 010 12M8.464 8.464a5 5 0 000 7.072M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'parking',      name: 'Parking',             desc: 'On-site vehicle parking',             icon: 'M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM3 4h13l4 4v4H3V4z' },
    { id: 'decoration',   name: 'Decoration',          desc: 'Floral & thematic decor setup',       icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { id: 'security',     name: 'Security',            desc: 'Trained security personnel',          icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { id: 'photography',  name: 'Photography',         desc: 'Photo booths & candid setup',         icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z' },
    { id: 'wifi',         name: 'High-Speed WiFi',     desc: 'Fibre broadband for all guests',      icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0' },
    { id: 'ac',           name: 'Air Conditioning',    desc: 'Central AC throughout venue',         icon: 'M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1010 16H2m15.73-8.27A2 2 0 1119 12H2' },
    { id: 'generator',    name: 'Generator Backup',    desc: '24/7 power backup available',         icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'bridal_room',  name: 'Bridal / VIP Room',  desc: 'Private suite for the main guests',   icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
    { id: 'kitchen',      name: 'Catering Kitchen',    desc: 'Commercial kitchen for external caterers', icon: 'M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z' },
    { id: 'stage',        name: 'Stage & Podium',      desc: 'Elevated stage with podium mic',      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  ];

  readonly form = this.fb.nonNullable.group({
    name:        ['', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    address:     ['', [Validators.required]],
    district:    ['', [Validators.required]],
    capacity:    ['', [Validators.required, Validators.min(1)]],
    pricePerSlot:['', [Validators.required, Validators.min(1)]],
    categoryId:  ['', [Validators.required, Validators.min(1)]],
  });

  toggleAmenity(id: string): void {
    this.selectedAmenities.update(set => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  isAmenitySelected(id: string): boolean {
    return this.selectedAmenities().has(id);
  }

  onDragOver(e: DragEvent): void  { e.preventDefault(); this.dragOver.set(true); }
  onDragLeave(): void             { this.dragOver.set(false); }
  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.dragOver.set(false);
    const files = Array.from(e.dataTransfer?.files ?? []).filter(f => f.type.startsWith('image/'));
    if (files.length) this.uploadFiles(files);
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.uploadFiles(Array.from(input.files));
    input.value = '';
  }

  private uploadFiles(files: File[]): void {
    this.uploading.set(true);
    forkJoin(files.map(f => this.cloudinary.upload(f))).subscribe({
      next: urls => { this.imageUrls.update(existing => [...existing, ...urls]); this.uploading.set(false); },
      error: ()  => { this.uploading.set(false); this.notification.error('Image upload failed. Please try again.'); },
    });
  }

  removeImage(url: string): void {
    this.imageUrls.update(existing => existing.filter(u => u !== url));
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.saving.set(true);
      const raw = this.form.getRawValue();
      this.venueService.createVenue({
        name:         raw.name,
        description:  raw.description,
        address:      raw.address,
        district:     raw.district,
        capacity:     Number(raw.capacity),
        pricePerSlot: Number(raw.pricePerSlot),
        categoryId:   Number(raw.categoryId),
        imageUrls:    this.imageUrls(),
        // amenities: Array.from(this.selectedAmenities()), // add when backend supports it
      }).subscribe({
        next: () => { this.saving.set(false); this.router.navigate(['/vendor/venues']); },
        error: ()  => { this.saving.set(false); this.notification.error('Failed to create venue. Please check your inputs.'); },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
