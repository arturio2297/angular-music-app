package com.musicapp.musicApp.core.message.auth;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum GrantType {
    @JsonProperty("password")
    Password,
    @JsonProperty("refresh_token")
    RefreshToken
}
