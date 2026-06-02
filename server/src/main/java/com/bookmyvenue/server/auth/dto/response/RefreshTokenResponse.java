package com.bookmyvenue.server.auth.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

/**for later scaling we are
 returning both access and refreshtoken . for token rotation **/

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Refresh token response")

public class RefreshTokenResponse {

    @Schema(description = "New JWT access token")
    private String accessToken;

    @Schema(description = "New JWT refresh token")
    private String refreshToken;
}