package com.musicapp.musicApp.core.contracts;

import com.musicapp.musicApp.core.message.track.TrackOrderResponse;
import com.musicapp.musicApp.data.model.track_order.TrackListType;
import com.musicapp.musicApp.data.model.track_order.TrackOrderId;

public interface TrackOrderService {
    TrackOrderResponse first(String listId);
    TrackOrderResponse get(TrackOrderId id);
    void order(TrackOrderId id, TrackListType listType);
    void updateOrder(TrackOrderId id);
    void changeOrder(String trackId1, String trackId2, String listId);
}
