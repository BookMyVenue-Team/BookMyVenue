package com.bookmyvenue.server.booking.dto.response;

import java.time.LocalTime;

public record AvailabilityResponse(
        LocalTime startTime,
        LocalTime endTime
) {
}