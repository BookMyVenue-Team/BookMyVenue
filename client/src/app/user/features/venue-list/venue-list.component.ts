import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VenueService } from '../../services/venue.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { Venue } from '../../../shared/models/venue.model';
import { VenueStatus } from '../../../shared/enums/venue-status.enum';

@Component({
  selector: 'app-venue-list',
  standalone: true,
  imports: [RouterLink, FormsModule, CurrencyFormatPipe],
  templateUrl: './venue-list.component.html',
  styleUrl: './venue-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VenueListComponent implements OnInit {
  private readonly venueService = inject(VenueService);

  // ── DUMMY DATA (comment out venues = dummyVenues and uncomment service line to use real data) ──
  readonly dummyVenues = signal<Venue[]>([
    { id: '1', name: 'The Grand Ballroom', description: '', address: '12 Marine Drive', district: 'Ernakulam', capacity: 500, pricePerSlot: 25000, category: 'Banquet Hall', status: VenueStatus.APPROVED, imageUrls: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80'] },
    { id: '2', name: 'Skyline Rooftop Terrace', description: '', address: '8 MG Road', district: 'Thrissur', capacity: 150, pricePerSlot: 12000, category: 'Rooftop', status: VenueStatus.APPROVED, imageUrls: ['https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80'] },
    { id: '3', name: 'Garden Pavilion', description: '', address: '34 NH Bypass', district: 'Kozhikode', capacity: 300, pricePerSlot: 18000, category: 'Outdoor', status: VenueStatus.APPROVED, imageUrls: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80'] },
    { id: '4', name: 'Heritage Haveli', description: '', address: '5 Fort Road', district: 'Thiruvananthapuram', capacity: 200, pricePerSlot: 22000, category: 'Heritage', status: VenueStatus.APPROVED, imageUrls: ['https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&q=80'] },
    { id: '5', name: 'The Conference Hub', description: '', address: '17 Technopark', district: 'Thiruvananthapuram', capacity: 80, pricePerSlot: 8000, category: 'Conference', status: VenueStatus.APPROVED, imageUrls: ['https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80'] },
    { id: '6', name: 'Lakeside Retreat', description: '', address: '2 Lake View Road', district: 'Alappuzha', capacity: 250, pricePerSlot: 20000, category: 'Resort', status: VenueStatus.APPROVED, imageUrls: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80'] },
  ]);

  // SWITCH: use dummyVenues for design, venueService.venues for real data
  readonly venues = this.dummyVenues;
  // readonly venues = this.venueService.venues;

  readonly loading = signal(false);
  // readonly loading = this.venueService.loading;

  readonly searchQuery = signal('');

  ngOnInit(): void {
    // Comment this in when switching to real data:
    // this.venueService.loadVenues();
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    // this.venueService.loadVenues({ search: query });
  }
}
