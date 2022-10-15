package com.musicapp.musicApp.core.message.album;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter@Setter
public class AlbumResponse {
    private String id;
    private String name;
    private boolean liked;
    private long likesCount;
    private boolean saved;
    private Date releasedAt;
    private String groupId;
    private String groupName;
    private List<String> genres;
    private long listening;
    private int tracksCount;
}
