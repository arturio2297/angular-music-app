package com.musicapp.musicApp.core.message.track_list;

import com.musicapp.musicApp.core.message.common.PageFilterParameters;
import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class UserTrackListFilterParameters extends PageFilterParameters {
    private String search;
    private String authorId;
}
