import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VenueService } from '../../services/venue.service';
import { Venue } from '../../../shared/models/venue.model';
import { VenueStatus } from '../../../shared/enums/venue-status.enum';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-venue-details',
  standalone: true,
  imports: [ButtonComponent, CurrencyFormatPipe, RouterLink],
  templateUrl: './venue-details.component.html',
  styleUrl: './venue-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VenueDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  // private readonly venueService = inject(VenueService); // uncomment when switching to real data

  readonly venue = signal<Venue | null>(null);
  readonly loading = signal(true);
  readonly selectedImage = signal(0);

  // ── DUMMY DATA (remove when switching to real backend) ──────────────────
  private readonly dummyVenues: Record<string, Venue> = {
    '1': {
      id: '1', name: 'The Grand Ballroom', category: 'Banquet Hall',
      address: '12 Marine Drive', district: 'Ernakulam',
      capacity: 500, pricePerSlot: 25000, status: VenueStatus.APPROVED,
      description: 'A magnificent ballroom with soaring ceilings, crystal chandeliers, and a grand stage. Perfect for large weddings, gala dinners, and corporate galas. The space features state-of-the-art sound and lighting systems, a dedicated catering kitchen, and an elegant pre-function foyer for cocktail receptions.',
      imageUrls: [
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80',
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
      ],
    },
    '2': {
      id: '2', name: 'Skyline Rooftop Terrace', category: 'Rooftop',
      address: '8 MG Road', district: 'Thrissur',
      capacity: 150, pricePerSlot: 12000, status: VenueStatus.APPROVED,
      description: 'An open-air rooftop venue with breathtaking panoramic city views. Features include a built-in bar, lounge seating, and fairy-light canopy. Ideal for cocktail parties, product launches, and intimate celebrations under the stars.',
      imageUrls: [
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
      ],
    },
    '3': {
      id: '3', name: 'Garden Pavilion', category: 'Outdoor',
      address: '34 NH Bypass', district: 'Kozhikode',
      capacity: 300, pricePerSlot: 18000, status: VenueStatus.APPROVED,
      description: 'A lush outdoor garden pavilion surrounded by manicured lawns and tropical foliage. The venue includes a covered pavilion, open-air stage, and ambient garden lighting. Perfect for outdoor weddings, cultural events, and family celebrations.',
      imageUrls: [
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80',
      ],
    },
    '4': {
      id: '4', name: 'Heritage Haveli', category: 'Heritage',
      address: '5 Fort Road', district: 'Thiruvananthapuram',
      capacity: 200, pricePerSlot: 22000, status: VenueStatus.APPROVED,
      description: 'A restored 19th-century heritage building featuring traditional Kerala architecture, ornate woodwork, and antique furnishings. The venue offers a unique blend of history and luxury, complete with a traditional courtyard, pillared halls, and a serene garden.',
      imageUrls: [
        'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1200&q=80',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80',
      ],
    },
    '5': {
      id: '5', name: 'The Conference Hub', category: 'Conference',
      address: '17 Technopark', district: 'Thiruvananthapuram',
      capacity: 80, pricePerSlot: 8000, status: VenueStatus.APPROVED,
      description: 'A modern conference centre equipped with the latest AV technology, high-speed Wi-Fi, and ergonomic seating. Includes a main auditorium, breakout rooms, and a catering lounge. Ideal for corporate meetings, seminars, workshops, and training sessions.',
      imageUrls: [
        'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&q=80',
      ],
    },
    '6': {
      id: '6', name: 'Lakeside Retreat', category: 'Resort',
      address: '2 Lake View Road', district: 'Alappuzha',
      capacity: 250, pricePerSlot: 20000, status: VenueStatus.APPROVED,
      description: 'A stunning lakeside resort venue with private waterfront access, infinity pool, and lush gardens. Features a grand event lawn, covered banquet hall, and floating stage on the lake. The perfect backdrop for destination weddings and luxury private events.',
      imageUrls: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80',
        'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1200&q=80',
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
      ],
    },
  };
  // ────────────────────────────────────────────────────────────────────────

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';

    // SWITCH: use dummyVenues for design, venueService for real data
    const venue = this.dummyVenues[id] ?? null;
    this.venue.set(venue);
    this.loading.set(false);

    // Uncomment below and remove the two lines above when switching to real data:
    // if (id) {
    //   this.venueService.loadVenueById(id).subscribe({
    //     next: (venue) => { this.venue.set(venue); this.loading.set(false); },
    //     error: () => this.loading.set(false),
    //   });
    // }
  }

  selectImage(index: number): void {
    this.selectedImage.set(index);
  }

  onBookNow(): void {
    const venue = this.venue();
    if (venue) {
      this.router.navigate(['/user/checkout', venue.id]);
    }
  }
}
