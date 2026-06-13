package com.bookmyvenue.server.booking.dto.request;

import java.time.LocalDate;

public record BookingRequest(
        LocalDate bookingDate
) {

}
