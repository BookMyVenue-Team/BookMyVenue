import { BookingStatus } from '../enums/booking-status.enum';

export interface Booking {
  id: number;
  venueId: number;
  slotTemplateId: number;
  bookingDate: string;
  status: BookingStatus;
  totalAmount: number;
  expiresAt: string;
}

export interface CreateBookingRequest {
  venueId: string;
  slotTemplateId: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  notes?: string;
}

export interface UpdateBookingRequest {
  eventDate?: string;
  startTime?: string;
  endTime?: string;
  guestCount?: number;
  status?: BookingStatus;
  notes?: string;
}
