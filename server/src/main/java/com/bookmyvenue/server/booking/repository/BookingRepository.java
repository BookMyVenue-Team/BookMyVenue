package com.bookmyvenue.server.booking.repository;

import com.bookmyvenue.server.booking.entity.Booking;
import com.bookmyvenue.server.booking.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository
        extends JpaRepository<Booking, Long> {

    boolean existsBySlotTemplateIdAndBookingDateAndStatusIn(
            Long slotTemplateId,
            LocalDate bookingDate,
            List<BookingStatus> statuses
    );

    List<Booking> findByUserId(UUID userId);

    List<Booking> findByVenueIdAndBookingDateAndStatusIn(
            Long venueId,
            LocalDate bookingDate,
            List<BookingStatus> statuses
    );

}