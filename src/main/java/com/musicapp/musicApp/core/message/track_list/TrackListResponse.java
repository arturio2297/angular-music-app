package com.musicapp.musicApp.core.message.track_list;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter@Setter
public class TrackListResponse {
    private String id;
    private String name;
    private List<String> genres;
    private String authorId;
    private boolean liked;
    private long likesCount;
    private boolean saved;
    private long listening;
    private int tracksCount;
}
