package com.musicapp.musicApp.core.message.common;

import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class FileRequest {
    private String base64;
    private String filename;
}
