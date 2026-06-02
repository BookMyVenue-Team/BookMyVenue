import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VenueService } from '../../services/venue.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-vendor-venue-list',
  standalone: true,
  imports: [RouterLink, LoaderComponent, EmptyStateComponent],
  templateUrl: './venue-list.component.html',
  styleUrl: './venue-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VenueListComponent implements OnInit {
  private readonly venueService = inject(VenueService);

  readonly venues = this.venueService.venues;
  readonly loading = this.venueService.loading;

  ngOnInit(): void {
    this.venueService.loadVendorVenues();
  }
}
