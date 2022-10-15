package com.musicapp.musicApp.core.message.account;

import com.musicapp.musicApp.core.message.common.FileRequest;
import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class UpdateAccountRequest {
    private String username;
    private String firstname;
    private String lastname;
    private FileRequest avatar;
}
