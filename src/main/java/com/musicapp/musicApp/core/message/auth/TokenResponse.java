package com.musicapp.musicApp.core.message.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter@Setter
public class TokenResponse {
    @JsonProperty("access_token")
    private String accessToken;
    @JsonProperty("access_expires_at")
    private OffsetDateTime accessExpiresAt;
    @JsonProperty("refresh_token")
    private String refreshToken;
    @JsonProperty("refresh_expires_at")
    private OffsetDateTime refreshExpiresAt;
}
