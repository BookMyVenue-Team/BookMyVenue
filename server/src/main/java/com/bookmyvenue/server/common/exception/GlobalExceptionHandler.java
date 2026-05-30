package com.bookmyvenue.server.common.exception;

import com.bookmyvenue.server.common.response.ApiErrorResponse;
import io.jsonwebtoken.JwtException;
import io.swagger.v3.oas.annotations.Hidden;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

/**
 * Centralized exception handler for the entire application.
 *
 * Converts application exceptions into consistent API error responses,
 * ensuring clients receive meaningful HTTP status codes and messages.
 */
@Hidden
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles attempts to create a user with an email or phone number
     * that already exists in the system.
     *
     * Returns HTTP 409 (Conflict).
     */
    @ExceptionHandler(UserAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ApiErrorResponse handleUserAlreadyExistsException(
            UserAlreadyExistsException ex,
            HttpServletRequest request
    ) {
        return buildErrorResponse(
                HttpStatus.CONFLICT,
                ex.getMessage(),
                request
        );
    }

    /**
     * Handles authentication failures such as invalid email or password.
     *
     * Returns HTTP 401 (Unauthorized).
     */
    @ExceptionHandler(InvalidCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiErrorResponse handleInvalidCredentialsException(
            InvalidCredentialsException ex,
            HttpServletRequest request
    ) {
        return buildErrorResponse(
                HttpStatus.UNAUTHORIZED,
                ex.getMessage(),
                request
        );
    }

    /**
     * Handles requests for resources that do not exist.
     *
     * Examples:
     * - User not found
     * - Venue not found
     * - Booking not found
     *
     * Returns HTTP 404 (Not Found).
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiErrorResponse handleResourceNotFoundException(
            ResourceNotFoundException ex,
            HttpServletRequest request
    ) {
        return buildErrorResponse(
                HttpStatus.NOT_FOUND,
                ex.getMessage(),
                request
        );
    }

    /**
     * Fallback handler for unexpected application errors.
     *
     * Prevents internal stack traces from being exposed to API consumers
     * and returns a generic error response.
     *
     * Returns HTTP 500 (Internal Server Error).
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiErrorResponse handleGenericException(
            Exception ex,
            HttpServletRequest request
    ) {
        return buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred",
                request
        );
    }

    /**
     * Handles requests that fail business validation rules.
     *
     * Examples:
     * - Admin self-registration attempted
     * - Invalid booking request
     * - Invalid venue configuration
     *
     * Returns HTTP 400 (Bad Request).
     */
    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiErrorResponse handleBadRequestException(
            BadRequestException ex,
            HttpServletRequest request
    ) {
        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage(),
                request
        );
    }


    /**
     * Handles JWT-related authentication failures.
     *
     * Examples:
     * - Expired token
     * - Invalid token signature
     * - Malformed token
     * - Tampered token
     *
     * Returns HTTP 401 (Unauthorized).
     */
    @ExceptionHandler(JwtException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiErrorResponse handleJwtException(
            JwtException ex,
            HttpServletRequest request
    ) {
        return buildErrorResponse(
                HttpStatus.UNAUTHORIZED,
                "Invalid or expired token",
                request
        );
    }


    /**
     * Creates a standardized error response object used across the API.
     */
    private ApiErrorResponse buildErrorResponse(
            HttpStatus status,
            String message,
            HttpServletRequest request
    ) {
        return ApiErrorResponse.builder()
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();
    }
}