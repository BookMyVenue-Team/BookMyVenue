package com.bookmyvenue.server.booking.controller;

import com.bookmyvenue.server.booking.dto.AvailabilityResponse;
import com.bookmyvenue.server.booking.service.AvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/venues")
@RequiredArgsConstructor
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    @GetMapping("/{venueId}/availability")
    public ResponseEntity<List<AvailabilityResponse>>
    getAvailability(
            @PathVariable Long venueId,
            @RequestParam LocalDate date
    ) {

        return ResponseEntity.ok(
                availabilityService.getAvailability(
                        venueId,
                        date
                )
        );
    }
}