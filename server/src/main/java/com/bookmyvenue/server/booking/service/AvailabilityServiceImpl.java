package com.bookmyvenue.server.booking.service;

import com.bookmyvenue.server.booking.dto.AvailabilityResponse;
import com.bookmyvenue.server.common.exception.BusinessException;
import com.bookmyvenue.server.common.exception.ErrorCode;
import com.bookmyvenue.server.slot.entity.SlotTemplate;
import com.bookmyvenue.server.slot.repository.SlotTemplateRepository;
import com.bookmyvenue.server.venue.entity.Venue;
import com.bookmyvenue.server.venue.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AvailabilityServiceImpl
        implements AvailabilityService {

    private final VenueRepository venueRepository;
    private final SlotTemplateRepository slotTemplateRepository;

    @Override
    public List<AvailabilityResponse> getAvailability(
            Long venueId,
            LocalDate date
    ) {

        log.info(
                "Fetching availability for venueId={} date={}",
                venueId,
                date
        );

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() ->
                        new BusinessException(
                                ErrorCode.VENUE_NOT_FOUND
                        ));

        DayOfWeek dayOfWeek = date.getDayOfWeek();

        List<SlotTemplate> templates =
                slotTemplateRepository
                        .findByVenueIdAndDayOfWeek(
                                venue.getId(),
                                dayOfWeek
                        );

        return templates.stream()
                .filter(SlotTemplate::isActive)
                .map(template ->
                        new AvailabilityResponse(
                                template.getStartTime(),
                                template.getEndTime()
                        )
                )
                .toList();
    }
}