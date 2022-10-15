package com.musicapp.musicApp.core.contracts;

import com.musicapp.musicApp.data.model.album.Album;
import com.musicapp.musicApp.data.model.track.Track;
import com.musicapp.musicApp.data.model.track_list.TrackList;

public interface SaveService {
    boolean save(Track track);
    boolean save(Album album);
    boolean save(TrackList trackList);
    boolean isTrackSaved(String trackId);
    boolean isTrackSaved(Track track);
    boolean isAlbumSaved(String albumId);
    boolean isAlbumSaved(Album album);
    boolean isTrackListSaved(String trackListId);
    boolean isTrackListSaved(TrackList trackList);
}
