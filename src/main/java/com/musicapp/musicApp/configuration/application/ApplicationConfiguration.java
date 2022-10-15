package com.musicapp.musicApp.configuration.application;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app")
@Getter@Setter
public class ApplicationConfiguration {
    private ApplicationAdmin admin;
    private String audioPath;
    private String imagesPath;
}
