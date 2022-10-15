package com.musicapp.musicApp.core.message.group;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter@Setter
public class GroupResponse {
    private String id;
    private String name;
    private String additionalInfo;
    private List<String> genres;
    private int albumsCount;
}
