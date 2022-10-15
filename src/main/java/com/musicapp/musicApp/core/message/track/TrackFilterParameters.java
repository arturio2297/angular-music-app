package com.musicapp.musicApp.core.message.track;

import com.musicapp.musicApp.core.message.common.PageFilterParameters;
import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class TrackFilterParameters extends PageFilterParameters {
    private String search;
    private String groupId;
    private String albumId;
    private String trackListId;
    private String notInGroup;
    private String notInAlbum;
    private String notInTrackList;
}
