package com.bookmyvenue.server.venue.controller;

import com.bookmyvenue.server.venue.dto.request.CreateVenueRequest;
import com.bookmyvenue.server.venue.dto.response.VenueResponse;
import com.bookmyvenue.server.venue.service.VenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class VenueController {

    private final VenueService venueService;

    @PostMapping("/vendor/venues")
    @ResponseStatus(HttpStatus.CREATED)
    public VenueResponse createVenue(
            @RequestBody CreateVenueRequest request
    ) {
        return venueService.createVenue(request);
    }

    @GetMapping("vendor/venues")
    @ResponseStatus(HttpStatus.OK)
    public List<VenueResponse> getAllVenues(){
        return venueService.getAllVenues();
    }

    @GetMapping("vendor/venues/{venueId}")
    @ResponseStatus(HttpStatus.OK)
    public VenueResponse getVenue(@PathVariable Long venueId){
        return venueService.getVenue(venueId);
    }

    @GetMapping("venues")
    @ResponseStatus(HttpStatus.OK)
    public List<VenueResponse> getApprovedVenues() {
        return venueService.getApprovedVenues();
    }

    @GetMapping("venues/{id}")
    @ResponseStatus(HttpStatus.OK)
    public VenueResponse getApprovedVenue(
            @PathVariable Long id
    ) {
        return venueService.getApprovedVenue(id);
    }
}
