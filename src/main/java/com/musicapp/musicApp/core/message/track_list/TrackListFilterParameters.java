package com.musicapp.musicApp.core.message.track_list;

import com.musicapp.musicApp.core.message.common.PageFilterParameters;
import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class TrackListFilterParameters extends PageFilterParameters {
    private String search;
    private String authorId;
    private String author;
    private int tracksCount;
    private String sort;
    private String order;
}
