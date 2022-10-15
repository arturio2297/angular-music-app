package com.musicapp.musicApp.core.message.track;

import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class AddTrackRequest {
    private String name;
    private String genre;
    private String albumId;
}
