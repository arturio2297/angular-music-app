package com.musicapp.musicApp.core.message.album;

import com.musicapp.musicApp.core.message.track.TrackItem;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter@Setter
public class AlbumItem {
    private String id;
    private String name;
    private boolean liked;
    private long likesCount;
    private boolean saved;
    private Date releasedAt;
    private String groupName;
    private String groupId;
    private List<TrackItem> tracks;
    private long listening;
    private int tracksCount;
}
