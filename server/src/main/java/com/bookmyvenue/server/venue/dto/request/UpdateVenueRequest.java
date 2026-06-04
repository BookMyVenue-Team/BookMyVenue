package com.bookmyvenue.server.venue.dto.request;

import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateVenueRequest {
    private String name;
    private String description;
    private String address;
    private String district;
    private Integer capacity;
    private BigDecimal pricePerSlot;
    private Long categoryId;
}