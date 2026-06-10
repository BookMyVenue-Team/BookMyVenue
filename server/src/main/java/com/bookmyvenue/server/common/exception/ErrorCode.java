package com.bookmyvenue.server.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Defines all application-specific error codes.
 *
 * Each error code contains:
 * - HTTP status to return
 * - Unique error code for clients
 * - Default error message
 */
@Getter
public enum ErrorCode {

    USER_ALREADY_EXISTS(
            HttpStatus.CONFLICT,
            "USER_ALREADY_EXISTS",
            "User already exists"
    ),
    PHONE_ALREADY_EXISTS(
            HttpStatus.CONFLICT,
            "PHONE_ALREADY_EXISTS",
            "phone number already registered"
    ),
    ADMIN_REGISTRATION_NOT_ALLOWED(
            HttpStatus.BAD_REQUEST,
            "ADMIN_REGISTRATION_NOT_ALLOWED",
            "admin registration not allowed"
    ),

    INVALID_CREDENTIALS(
            HttpStatus.UNAUTHORIZED,
            "INVALID_CREDENTIALS",
            "Invalid credentials"
    ),

    VENUE_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "VENUE_NOT_FOUND",
            "Venue not found"
    ),

    VENUE_CATEGORY_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "VENUE_CATEGORY_NOT_FOUND",
            "Venue category not found"
    ),

    BOOKING_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "BOOKING_NOT_FOUND",
            "Booking not found"
    ),

    ACCESS_DENIED(
            HttpStatus.FORBIDDEN,
            "ACCESS_DENIED",
            "Access denied"
    ),

    BAD_REQUEST(
            HttpStatus.BAD_REQUEST,
            "BAD_REQUEST",
            "Invalid request"
    ),
    USER_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "USER NOT FOUND",
            "user not found"
    ),

    INVALID_REFRESH_TOKEN(
            HttpStatus.UNAUTHORIZED,
            "INVALID_REFRESH_TOKEN",
            "Invalid or expired token"
    ),
    INVALID_TIME_RANGE(HttpStatus.BAD_REQUEST,
            " INVALID_TIME_RANGE",
            "End time must be after start time"),

    SLOT_TEMPLATE_NOT_FOUND(HttpStatus.NOT_FOUND,
            " SLOT_TEMPLATE_NOT_FOUND",
            "Slot template not found"),

    OVERLAPPING_SLOT_TEMPLATE(HttpStatus.BAD_REQUEST,
            "OVERLAPPING_SLOT_TEMPLATE",
            "Slot template overlaps with existing schedule");


    private final HttpStatus status;
    private final String code;
    private final String message;

    ErrorCode(
            HttpStatus status,
            String code,
            String message
    ) {
        this.status = status;
        this.code = code;
        this.message = message;
    }
}
