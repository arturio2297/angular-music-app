package com.musicapp.musicApp.core.message.track_list;

import com.musicapp.musicApp.core.message.common.FileRequest;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter@Setter
public class UpdateTrackListRequest {
    private String name;
    private FileRequest image;
    private List<String> addedTracksIds;
    private List<String> deletedTracksIds;
}
