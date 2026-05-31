package com.bookmyvenue.server.venue.service;

import com.bookmyvenue.server.venue.dto.request.CreateVenueRequest;
import com.bookmyvenue.server.venue.dto.response.VenueResponse;

public interface VenueService {
    public VenueResponse createVenue(CreateVenueRequest request);
}
