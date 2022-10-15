package com.musicapp.musicApp.core.message.group;

import com.musicapp.musicApp.core.message.track.TrackItem;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter@Setter
public class GroupItem {
    private String id;
    private String name;
    private List<TrackItem> tracks;
    private int albumsCount;
}
