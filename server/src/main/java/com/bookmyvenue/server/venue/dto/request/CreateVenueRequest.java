package com.bookmyvenue.server.venue.dto.request;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateVenueRequest {

    private String name;
    private String description;
    private String address;
    private String district;

    private Integer capacity;

    private BigDecimal pricePerSlot;

    private Long categoryId;

    private List<String> imageUrls;
}