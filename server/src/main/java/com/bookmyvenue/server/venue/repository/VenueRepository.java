package com.bookmyvenue.server.venue.repository;

import com.bookmyvenue.server.venue.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VenueRepository extends JpaRepository<Venue,Long> {
}
