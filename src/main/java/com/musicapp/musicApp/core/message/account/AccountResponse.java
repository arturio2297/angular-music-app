package com.musicapp.musicApp.core.message.account;

import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class AccountResponse {
    private String id;
    private String email;
    private String username;
    private String firstname;
    private String lastname;
    private String role;
}
