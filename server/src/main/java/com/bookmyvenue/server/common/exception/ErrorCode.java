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

    INVALID_TOKEN(
            HttpStatus.UNAUTHORIZED,
            "INVALID_TOKEN",
            "Invalid or expired token"
    );

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
