package com.musicapp.musicApp.core.message.track;

import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class TrackItem {
    private String id;
    private String name;
    private String filename;
    private String genre;
    private boolean liked;
    private long likesCount;
    private boolean saved;
    private String albumName;
    private String albumId;
    private String groupName;
    private String groupId;
    private String trackListName;
    private String trackListId;
    private long order;
}
