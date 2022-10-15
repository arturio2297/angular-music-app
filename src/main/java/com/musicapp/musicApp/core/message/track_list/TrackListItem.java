package com.musicapp.musicApp.core.message.track_list;

import com.musicapp.musicApp.core.message.track.TrackItem;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter@Setter
public class TrackListItem {
    private String id;
    private String name;
    private String authorId;
    private String authorUsername;
    private boolean liked;
    private long likesCount;
    private boolean saved;
    private List<TrackItem> tracks;
    private long listening;
    private int tracksCount;
}
