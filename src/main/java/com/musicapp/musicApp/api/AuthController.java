package com.musicapp.musicApp.api;

import com.musicapp.musicApp.core.ApplicationException;
import com.musicapp.musicApp.core.contracts.AuthenticationService;
import com.musicapp.musicApp.core.message.auth.GrantType;
import com.musicapp.musicApp.core.message.auth.TokenRequest;
import com.musicapp.musicApp.core.message.auth.TokenResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/v1/token")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authService;

    @PostMapping
    @Transactional
    public TokenResponse login(@RequestBody TokenRequest request) throws ApplicationException {
        if (request.getGrantType() == GrantType.Password) {
            return authService.authenticate(request.getUsername(), request.getPassword());
        }
        return authService.refresh(request.getRefreshToken());
    }

}
