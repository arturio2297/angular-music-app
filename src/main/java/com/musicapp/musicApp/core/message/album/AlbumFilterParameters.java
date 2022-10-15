package com.musicapp.musicApp.core.message.album;

import com.musicapp.musicApp.core.message.common.PageFilterParameters;
import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class AlbumFilterParameters extends PageFilterParameters {
    private String search;
    private String groupId;
    private int tracksCount;
    private String sort;
    private String order;
}
