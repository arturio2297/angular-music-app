package com.musicapp.musicApp.core.message.track;

import com.musicapp.musicApp.data.model.track_order.TrackListType;
import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class TrackOrderResponse {
    private long count;
    private String nextId;
    private String currentId;
    private String previousId;
    private boolean isFirst;
    private boolean isLast;
    private TrackListType listType;
}
