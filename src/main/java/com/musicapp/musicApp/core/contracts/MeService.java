package com.musicapp.musicApp.core.contracts;

import com.musicapp.musicApp.core.message.album.AlbumItem;
import com.musicapp.musicApp.core.message.album.UserAlbumFilterParameters;
import com.musicapp.musicApp.core.message.common.PageResponse;
import com.musicapp.musicApp.core.message.track.TrackItem;
import com.musicapp.musicApp.core.message.track.UserTrackFilterParameters;
import com.musicapp.musicApp.core.message.track_list.TrackListItem;
import com.musicapp.musicApp.core.message.track_list.UserTrackListFilterParameters;

public interface MeService {
    PageResponse<AlbumItem> albums(UserAlbumFilterParameters parameters);
    PageResponse<TrackListItem> trackLists(UserTrackListFilterParameters parameters);
    PageResponse<TrackItem> tracks(UserTrackFilterParameters parameters);
}
