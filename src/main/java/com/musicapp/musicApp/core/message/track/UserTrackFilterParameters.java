package com.musicapp.musicApp.core.message.track;

import com.musicapp.musicApp.core.message.common.PageFilterParameters;
import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class UserTrackFilterParameters extends PageFilterParameters {
    private String search;
}
