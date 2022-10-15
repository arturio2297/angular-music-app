package com.musicapp.musicApp.configuration.security.auth;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "auth")
@Getter@Setter
public class AuthConfiguration {
    private String secret;
    private int accessExpirationHours;
    private int refreshExpirationHours;
}
