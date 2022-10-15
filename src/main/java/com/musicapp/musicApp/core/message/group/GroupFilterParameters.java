package com.musicapp.musicApp.core.message.group;

import com.musicapp.musicApp.core.message.common.PageFilterParameters;
import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class GroupFilterParameters extends PageFilterParameters {
    private String search;
    private int tracksCount;
}
