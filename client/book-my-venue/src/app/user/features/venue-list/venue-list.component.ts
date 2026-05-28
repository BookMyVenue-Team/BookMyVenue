import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VenueService } from '../../services/venue.service';
import { Venue } from '../../../shared/models/venue.model';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-venue-list',
  standalone: true,
  imports: [RouterLink, FormsModule, LoaderComponent, EmptyStateComponent, PaginationComponent, CurrencyFormatPipe],
  templateUrl: './venue-list.component.html',
  styleUrl: './venue-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VenueListComponent implements OnInit {
  private readonly venueService = inject(VenueService);

  readonly venues = this.venueService.venues;
  readonly loading = this.venueService.loading;
  readonly totalPages = this.venueService.totalPages;
  readonly currentPage = signal(1);
  readonly searchQuery = signal('');

  ngOnInit(): void {
    this.venueService.loadVenues({ page: 1, limit: 12 });
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
    this.venueService.loadVenues({ search: query, page: 1, limit: 12 });
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.venueService.loadVenues({ search: this.searchQuery(), page, limit: 12 });
  }
}
