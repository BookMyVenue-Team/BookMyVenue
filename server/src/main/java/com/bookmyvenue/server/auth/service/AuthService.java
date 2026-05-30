package com.bookmyvenue.server.auth.service;

import com.bookmyvenue.server.auth.dto.request.LoginRequest;
import com.bookmyvenue.server.auth.dto.request.RefreshTokenRequest;
import com.bookmyvenue.server.auth.dto.request.RegisterRequest;
import com.bookmyvenue.server.auth.dto.response.AuthResponse;
import com.bookmyvenue.server.auth.dto.response.RefreshTokenResponse;

public interface AuthService {

    /**
     * Registers a new USER or VENDOR account.
     */
    AuthResponse register(RegisterRequest request);

    /**
     * Authenticates a user and returns JWT tokens.
     */
    AuthResponse login(LoginRequest request);


    /**
     * Generates a new access token using a valid refresh token.
     */
    RefreshTokenResponse refreshToken(RefreshTokenRequest request);
}