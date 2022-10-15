package com.musicapp.musicApp.core.message.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class TokenRequest {
    @JsonProperty("grant_type")
    private GrantType grantType;
    private String username;
    private String password;
    @JsonProperty("refresh_token")
    private String refreshToken;
}
