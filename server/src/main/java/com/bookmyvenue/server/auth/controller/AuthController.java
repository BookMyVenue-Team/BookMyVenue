package com.bookmyvenue.server.auth.controller;

import com.bookmyvenue.server.auth.dto.request.LoginRequest;
import com.bookmyvenue.server.auth.dto.request.RefreshTokenRequest;
import com.bookmyvenue.server.auth.dto.request.RegisterRequest;
import com.bookmyvenue.server.auth.dto.response.AuthResponse;
import com.bookmyvenue.server.auth.dto.response.RefreshTokenResponse;
import com.bookmyvenue.server.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication and account management APIs")
public class AuthController {

    private final AuthService authService;

    @Operation(
            summary = "Register a new account",
            description = "Creates a new USER or VENDOR account and returns JWT tokens."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Registration successful"),
            @ApiResponse(responseCode = "400", description = "Invalid request or ADMIN registration attempted"),
            @ApiResponse(responseCode = "409", description = "Email or phone already exists")
    })
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }



    @Operation(
            summary = "Authenticate user",
            description = "Authenticates a user and returns JWT tokens."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login successful"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }



    @Operation(
            summary = "Refresh JWT tokens",
            description = "Generates new access and refresh tokens using a valid refresh token."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tokens refreshed successfully"),
            @ApiResponse(responseCode = "401", description = "Invalid or expired refresh token")
    })
    @PostMapping("/refresh-token")
    public ResponseEntity<RefreshTokenResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {

        RefreshTokenResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }



}