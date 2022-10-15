package com.musicapp.musicApp.core.contracts;

import com.musicapp.musicApp.core.ApplicationException;
import com.musicapp.musicApp.core.message.registration.RegistrationRequest;

public interface RegistrationService {
    void register(RegistrationRequest request) throws ApplicationException;
    boolean checkExistsByEmail(String email);
    boolean checkExistsByUsername(String username);
}
