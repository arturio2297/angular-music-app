package com.musicapp.musicApp.core.contracts;

import com.musicapp.musicApp.core.message.common.LikeResponse;
import com.musicapp.musicApp.data.model.album.Album;
import com.musicapp.musicApp.data.model.track.Track;
import com.musicapp.musicApp.data.model.track_list.TrackList;

public interface LikeService {
    LikeResponse like(Track track);
    LikeResponse like(Album album);
    LikeResponse like(TrackList trackList);
    LikeResponse isTrackLiked(String trackId);
    LikeResponse isTrackLiked(Track track);
    LikeResponse isAlbumLiked(String albumId);
    LikeResponse isAlbumLiked(Album album);
    LikeResponse isTrackListLiked(String trackListId);
    LikeResponse isTrackListLiked(TrackList trackList);
}
