package com.musicapp.musicApp.configuration.application;

import com.musicapp.musicApp.core.contracts.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ApplicationEventListener {

    private final UserService userService;
    private final ApplicationConfiguration configuration;

    @EventListener(ApplicationReadyEvent.class)
    public void handleApplicationReadyEvent() {
        userService.init(configuration.getAdmin());
    }

}
