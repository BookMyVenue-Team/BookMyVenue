import { VenueStatus } from '../enums/venue-status.enum';

export interface Venue {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  capacity: number;
  pricePerHour: number;
  pricePerDay: number;
  amenities: string[];
  images: string[];
  status: VenueStatus;
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVenueRequest {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  capacity: number;
  pricePerHour: number;
  pricePerDay: number;
  amenities: string[];
  images: string[];
}

export interface UpdateVenueRequest {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  capacity?: number;
  pricePerHour?: number;
  pricePerDay?: number;
  amenities?: string[];
  images?: string[];
  status?: VenueStatus;
}

export interface VenueFilter {
  city?: string;
  minCapacity?: number;
  maxCapacity?: number;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  status?: VenueStatus;
  search?: string;
  page?: number;
  limit?: number;
}
