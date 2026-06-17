import { BookingStatus } from '../enums/booking-status.enum';

export interface Booking {
  id: string;
  userId: string;
  venueId: string;
  venueName: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  totalAmount: number;
  status: BookingStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  venueId: string;
  slotTemplateId: number;
  eventDate: string;
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
