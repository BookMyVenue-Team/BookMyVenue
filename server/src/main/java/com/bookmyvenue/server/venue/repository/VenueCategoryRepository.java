package com.bookmyvenue.server.venue.repository;

import com.bookmyvenue.server.venue.entity.VenueCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VenueCategoryRepository extends JpaRepository<VenueCategory, Long> {
}
