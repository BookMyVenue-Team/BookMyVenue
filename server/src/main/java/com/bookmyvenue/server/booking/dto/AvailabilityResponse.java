package com.bookmyvenue.server.booking.dto;

import java.time.LocalTime;

public record AvailabilityResponse(
        LocalTime startTime,
        LocalTime endTime
) {
}