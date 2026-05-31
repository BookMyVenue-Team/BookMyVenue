package com.bookmyvenue.server.venue.service;

import com.bookmyvenue.server.user.entity.User;
import com.bookmyvenue.server.user.repository.UserRepository;
import com.bookmyvenue.server.venue.dto.request.CreateVenueRequest;
import com.bookmyvenue.server.venue.dto.response.VenueResponse;
import com.bookmyvenue.server.venue.entity.Venue;
import com.bookmyvenue.server.venue.entity.VenueCategory;
import com.bookmyvenue.server.venue.entity.VenueStatus;
import com.bookmyvenue.server.venue.repository.VenueCategoryRepository;
import com.bookmyvenue.server.venue.repository.VenueRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@Transactional
public class VenueServiceImpl implements VenueService {

    private final VenueRepository venueRepository;
    private final VenueCategoryRepository venueCategoryRepository;
    private final UserRepository userRepository;

    @Override
    public VenueResponse createVenue(CreateVenueRequest request) {

        VenueCategory category = venueCategoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException("Venue category not found"));

        // TODO: Replace ownerId with authenticated user from SecurityContext once JWT integration is completed.
        User owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(()->
                        new RuntimeException("user not found"));

        Venue venue = Venue.builder()
                .name(request.getName())
                .description(request.getDescription())
                .address(request.getAddress())
                .district(request.getDistrict())
                .capacity(request.getCapacity())
                .pricePerSlot(request.getPricePerSlot())
                .category(category)
                .status(VenueStatus.PENDING_APPROVAL)
                .owner(owner)
                .build();

        Venue savedVenue = venueRepository.save(venue);

        return VenueResponse.builder()
                .id(savedVenue.getId())
                .name(savedVenue.getName())
                .description(savedVenue.getDescription())
                .address(savedVenue.getAddress())
                .district(savedVenue.getDistrict())
                .capacity(savedVenue.getCapacity())
                .pricePerSlot(savedVenue.getPricePerSlot())
                .category(savedVenue.getCategory().getName())
                .status(savedVenue.getStatus())
                .build();
    }
}