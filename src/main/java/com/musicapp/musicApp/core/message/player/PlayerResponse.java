package com.musicapp.musicApp.core.message.player;

import com.musicapp.musicApp.core.message.track.TrackItem;
import com.musicapp.musicApp.data.model.track_order.TrackListType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PlayerResponse {
    private long count;
    private TrackItem next;
    private TrackItem current;
    private TrackItem previous;
    private boolean first;
    private boolean last;
    private TrackListType listType;
}
