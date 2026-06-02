import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { Venue } from '../../../shared/models/venue.model';

@Component({
  selector: 'app-admin-venues', standalone: true, imports: [LoaderComponent, EmptyStateComponent],
  templateUrl: './venues.component.html', styleUrl: './venues.component.css', changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VenuesComponent {
  readonly venues = signal<Venue[]>([]);
  readonly loading = signal(false);
}
