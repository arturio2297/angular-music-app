package com.musicapp.musicApp.core.message.common;

import lombok.Getter;
import lombok.Setter;
import org.springframework.core.io.Resource;

@Getter@Setter
public class FileResponse {
    private String contentType;
    private Resource resource;
}
