package com.bookmyvenue.server.venue.service;

import com.bookmyvenue.server.auth.service.AuthenticatedUserService;
import com.bookmyvenue.server.common.exception.BusinessException;
import com.bookmyvenue.server.common.exception.ErrorCode;
import com.bookmyvenue.server.user.entity.User;
import com.bookmyvenue.server.user.repository.UserRepository;
import com.bookmyvenue.server.venue.dto.request.CreateVenueRequest;
import com.bookmyvenue.server.venue.dto.request.UpdateVenueRequest;
import com.bookmyvenue.server.venue.dto.response.VenueResponse;
import com.bookmyvenue.server.venue.entity.Venue;
import com.bookmyvenue.server.venue.entity.VenueCategory;
import com.bookmyvenue.server.venue.entity.VenueStatus;
import com.bookmyvenue.server.venue.mapper.VenueMapper;
import com.bookmyvenue.server.venue.repository.VenueCategoryRepository;
import com.bookmyvenue.server.venue.repository.VenueRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class VenueServiceImpl implements VenueService {

    private final VenueRepository venueRepository;
    private final VenueCategoryRepository venueCategoryRepository;
    private final VenueMapper venueMapper;
    private final AuthenticatedUserService authenticatedUserService;

    @Override
    public VenueResponse createVenue(CreateVenueRequest request) {
        log.info("Creating venue with name: {}, categoryId: {}",
                request.getName(),
                request.getCategoryId());
        VenueCategory category = venueCategoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.VENUE_CATEGORY_NOT_FOUND));

        // Get currently authenticated venue owner
        User currentUser =
                authenticatedUserService.getCurrentUser();


        // New venues require admin approval before becoming visible
        Venue venue = Venue.builder()
                .name(request.getName())
                .description(request.getDescription())
                .address(request.getAddress())
                .district(request.getDistrict())
                .capacity(request.getCapacity())
                .pricePerSlot(request.getPricePerSlot())
                .category(category)
                .status(VenueStatus.PENDING_APPROVAL)
                .owner(currentUser)
                .build();

        Venue savedVenue = venueRepository.save(venue);
        log.info("Venue created successfully. venueId={}, ownerId={}",
                savedVenue.getId(),
                currentUser.getId());

        return venueMapper.toResponse(savedVenue);
    }

    @Override
    public List<VenueResponse> getAllVenues() {
      List<Venue> venues = venueRepository.findAll()
              .stream().toList();
      return venueMapper.toResponse(venues);
    }

    @Override
    public VenueResponse getVenue(Long venueId) {
        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(()->
                        new BusinessException(ErrorCode.VENUE_NOT_FOUND));
        return venueMapper.toResponse(venue);
    }

    @Override
    public List<VenueResponse> getApprovedVenues(
            String keyword,
            String district,
            Long categoryId
    ) {

        List<Venue> venues;

        if (keyword != null && !keyword.isBlank()) {

            venues = venueRepository.findByStatusAndNameContainingIgnoreCase(
                    VenueStatus.APPROVED,
                    keyword
            );

        } else if (district != null && categoryId != null) {

            venues = venueRepository
                    .findByStatusAndDistrictIgnoreCaseAndCategoryId(
                            VenueStatus.APPROVED,
                            district,
                            categoryId
                    );

        } else if (district != null) {

            venues = venueRepository
                    .findByStatusAndDistrictContainingIgnoreCase(
                            VenueStatus.APPROVED,
                            district
                    );

        } else if (categoryId != null) {

            venues = venueRepository
                    .findByStatusAndCategoryId(
                            VenueStatus.APPROVED,
                            categoryId
                    );

        } else {

            venues = venueRepository.findByStatus(
                    VenueStatus.APPROVED
            );
        }

        return venues.stream()
                .map(venueMapper::toResponse)
                .toList();
    }

    @Override
    public VenueResponse getApprovedVenue(Long id) {

        Venue venue = venueRepository
                .findByIdAndStatus(id, VenueStatus.APPROVED)
                .orElseThrow(()->
                        new BusinessException(ErrorCode.VENUE_NOT_FOUND));

        return venueMapper.toResponse(venue);
    }

    @Override
    public VenueResponse updateVenue(
            Long venueId,
            UpdateVenueRequest request
    ) {

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(()->
                        new BusinessException(ErrorCode.VENUE_NOT_FOUND));

        // Ensure only the venue owner can modify venue details
        User currentUser = authenticatedUserService.getCurrentUser();
        if (!venue.getOwner().getId().equals(currentUser.getId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        log.warn(
                "Unauthorized venue update attempt. venueId={}, ownerId={}, requesterId={}",
                venueId,
                venue.getOwner().getId(),
                currentUser.getId()
        );
        if (request.getName() != null) {
            venue.setName(request.getName());
        }

        if (request.getDescription() != null) {
            venue.setDescription(request.getDescription());
        }

        if (request.getAddress() != null) {
            venue.setAddress(request.getAddress());
        }

        if (request.getDistrict() != null) {
            venue.setDistrict(request.getDistrict());
        }

        if (request.getCapacity() != null) {
            venue.setCapacity(request.getCapacity());
        }

        if (request.getPricePerSlot() != null) {
            venue.setPricePerSlot(request.getPricePerSlot());
        }

        if (request.getCategoryId() != null) {

            VenueCategory category = venueCategoryRepository
                    .findById(request.getCategoryId())
                    .orElseThrow(() ->
                           new BusinessException(ErrorCode.VENUE_CATEGORY_NOT_FOUND));

            venue.setCategory(category);
        }

        Venue updatedVenue = venueRepository.save(venue);

        log.info(
                "Venue updated. venueId={}, ownerId={}",
                updatedVenue.getId(),
                currentUser.getId()
        );

        return venueMapper.toResponse(updatedVenue);
    }

    @Override
    public void deleteVenue(Long venueId){
        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.VENUE_NOT_FOUND));

            User currentUser = authenticatedUserService.getCurrentUser();

          // Ensure only the venue owner can delete the venue
            if (!venue.getOwner().getId().equals(currentUser.getId())) {
                log.warn(
                        "Unauthorized venue delete attempt. venueId={}, ownerId={}, requesterId={}",
                        venueId,
                        venue.getOwner().getId(),
                        currentUser.getId()
                );
                throw new BusinessException(ErrorCode.ACCESS_DENIED);
            }
        venueRepository.delete(venue);

        log.info(
                "Venue deleted. venueId={}, ownerId={}",
                venueId,
                currentUser.getId()
        );
    }
}