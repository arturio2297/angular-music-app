package com.musicapp.musicApp.core.message.group;

import com.musicapp.musicApp.core.message.common.FileRequest;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter@Setter
public class AddGroupRequest {
    private String name;
    private String additionalInfo;
    private FileRequest image;
}
