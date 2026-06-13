package com.bookmyvenue.server.booking.controller;

import com.bookmyvenue.server.booking.dto.request.BookingRequest;
import com.bookmyvenue.server.booking.dto.response.BookingResponse;
import com.bookmyvenue.server.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping(
            "/venues/{venueId}/slots/{slotTemplateId}/bookings"
    )
    @ResponseStatus(HttpStatus.CREATED)
    public BookingResponse createBooking(
            @PathVariable Long venueId,
            @PathVariable Long slotTemplateId,
            @RequestBody BookingRequest request
    ) {

        return bookingService.createBooking(
                venueId,
                slotTemplateId,
                request
        );
    }

    @GetMapping("/bookings/my-bookings")
    @ResponseStatus(HttpStatus.OK)
    public List<BookingResponse> getMyBookings() {

        return bookingService.getMyBookings();
    }

    @PostMapping("/bookings/{bookingId}/cancel")
    @ResponseStatus(HttpStatus.OK)
    public void cancelBooking(
            @PathVariable Long bookingId
    ) {

        bookingService.cancelBooking(
                bookingId
        );
    }
}
