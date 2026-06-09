package com.bookmyvenue.server.auth.controller;

import com.bookmyvenue.server.auth.dto.request.LoginRequest;
import com.bookmyvenue.server.auth.dto.request.RegisterRequest;
import com.bookmyvenue.server.auth.dto.response.AuthResponse;
import com.bookmyvenue.server.auth.dto.response.AuthResult;
import com.bookmyvenue.server.auth.security.CookieUtils;
import com.bookmyvenue.server.auth.service.AuthService;
import com.bookmyvenue.server.common.exception.BusinessException;
import com.bookmyvenue.server.common.exception.ErrorCode;
import com.bookmyvenue.server.common.response.ApiErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication and account management APIs")
public class AuthController {

    private final AuthService authService;
    private final CookieUtils cookieUtils;

    @Operation(summary = "Register a new account", description = "Creates a new USER or VENDOR account and sets authentication cookies.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Registration successful"),
            @ApiResponse(responseCode = "400", description = "Invalid request or ADMIN registration attempted",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Email or phone already exists",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {

        AuthResult result = authService.register(request);
        ResponseCookie accessCookie = cookieUtils.accessTokenCookie(result.accessToken());
        ResponseCookie refreshCookie = cookieUtils.refreshTokenCookie(result.refreshToken());

        System.out.println(accessCookie);
        System.out.println(refreshCookie);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(result.response());
    }



    @Operation(summary = "Authenticate user", description = "Authenticates a user and sets authentication cookies.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Login successful"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {

        AuthResult result = authService.login(request);
        ResponseCookie accessCookie = cookieUtils.accessTokenCookie(result.accessToken());
        ResponseCookie refreshCookie = cookieUtils.refreshTokenCookie(result.refreshToken());
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(result.response());
    }



    @Operation(summary = "Refresh JWT tokens", description = "Generates new authentication cookies using a valid refresh token.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tokens refreshed successfully"),
            @ApiResponse(responseCode = "401", description = "Missing, invalid or expired refresh token",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(@CookieValue(value=CookieUtils.REFRESH_TOKEN,required = false) String refreshToken) {

        if (refreshToken == null) {
            throw new BusinessException(ErrorCode.INVALID_REFRESH_TOKEN);
        }
        AuthResult result = authService.refreshToken(refreshToken);
        ResponseCookie accessCookie = cookieUtils.accessTokenCookie(result.accessToken());
        ResponseCookie refreshCookie = cookieUtils.refreshTokenCookie(result.refreshToken());
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(result.response());
    }




    @Operation(summary = "Logout user", description = "Clears authentication cookies.")
    @ApiResponse(responseCode = "204", description = "Logout successful")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, cookieUtils.clearAccessTokenCookie().toString())
                .header(HttpHeaders.SET_COOKIE, cookieUtils.clearRefreshTokenCookie().toString())
                .build();
    }

}