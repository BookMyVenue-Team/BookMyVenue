package com.bookmyvenue.server.venue.repository;

import com.bookmyvenue.server.venue.entity.Venue;
import com.bookmyvenue.server.venue.entity.VenueStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VenueRepository extends JpaRepository<Venue,Long> {
    List<Venue> findByStatus(VenueStatus status);
    Optional<Venue> findByIdAndStatus(
            Long id,
            VenueStatus status
    );
}
