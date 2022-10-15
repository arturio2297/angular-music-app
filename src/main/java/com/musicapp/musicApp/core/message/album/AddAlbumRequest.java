package com.musicapp.musicApp.core.message.album;

import com.musicapp.musicApp.core.message.common.FileRequest;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter@Setter
public class AddAlbumRequest {
    private String name;
    private Date releasedAt;
    private String groupId;
    private FileRequest image;
}
