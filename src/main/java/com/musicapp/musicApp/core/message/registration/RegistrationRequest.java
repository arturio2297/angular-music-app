package com.musicapp.musicApp.core.message.registration;

import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class RegistrationRequest {
    private String email;
    private String username;
    private String firstname;
    private String lastname;
    private String password;
}
