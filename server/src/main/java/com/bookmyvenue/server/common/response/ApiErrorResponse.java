package com.bookmyvenue.server.common.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiErrorResponse {

    private int status;

    private String error;

    private String message;

    private String path;

    private LocalDateTime timestamp;
}