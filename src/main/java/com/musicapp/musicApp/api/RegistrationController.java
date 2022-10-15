package com.musicapp.musicApp.api;

import com.musicapp.musicApp.core.ApplicationException;
import com.musicapp.musicApp.core.contracts.RegistrationService;
import com.musicapp.musicApp.core.message.registration.RegistrationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/registration")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping
    @Transactional
    public void register(@RequestBody RegistrationRequest request) throws ApplicationException {
        registrationService.register(request);
    }

    @GetMapping(value = "/check/email")
    public boolean checkEmail(@RequestParam String email) {
        return registrationService.checkExistsByEmail(email);
    }

    @GetMapping(value = "/check/username")
    public boolean checkUsername(@RequestParam String username) {
        return registrationService.checkExistsByUsername(username);
    }

}
