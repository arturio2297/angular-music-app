package com.musicapp.musicApp.services.like;

import com.musicapp.musicApp.core.contracts.AccountService;
import com.musicapp.musicApp.core.contracts.LikeService;
import com.musicapp.musicApp.core.message.common.LikeResponse;
import com.musicapp.musicApp.data.model.album.Album;
import com.musicapp.musicApp.data.model.track.Track;
import com.musicapp.musicApp.data.model.track_list.TrackList;
import com.musicapp.musicApp.data.model.user.User;
import com.musicapp.musicApp.data.repositories.AlbumRepository;
import com.musicapp.musicApp.data.repositories.TrackListRepository;
import com.musicapp.musicApp.data.repositories.TrackRepository;
import com.musicapp.musicApp.data.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class LikeServiceImpl implements LikeService {

    private final AccountService accountService;
    private final UserRepository userRepository;
    private final TrackRepository trackRepository;
    private final AlbumRepository albumRepository;
    private final TrackListRepository trackListRepository;

    @Override
    public LikeResponse like(Track track) {
        final User user = getAccount();
        final Set<Track> tracks = user.getLikedTracks();

        boolean liked = true;

        if (tracks.contains(track)) {
            tracks.remove(track);
            liked = false;
        } else {
            tracks.add(track);
        }

        userRepository.save(user);
        return new LikeResponse(liked, track.getLikes().size());
    }

    @Override
    public LikeResponse like(Album album) {
        final User user = getAccount();
        final Set<Album> albums = user.getLikedAlbums();

        boolean liked = true;

        if (albums.contains(album)) {
            albums.remove(album);
            liked = false;
        } else {
            albums.add(album);
        }

        userRepository.save(user);
        return new LikeResponse(liked, album.getLikes().size());
    }

    @Override
    public LikeResponse like(TrackList trackList) {
        final User user = getAccount();
        final Set<TrackList> trackLists = user.getLikedTrackLists();

        boolean liked = true;

        if (trackLists.contains(trackList)) {
            trackLists.remove(trackList);
            liked = false;
        } else {
            trackLists.add(trackList);
        }

        userRepository.save(user);
        return new LikeResponse(liked, trackList.getLikes().size());
    }

    @Override
    public LikeResponse isTrackLiked(String trackId) {
        final Track track = trackRepository.findById(trackId).orElse(null);
        return isTrackLiked(track);
    }

    @Override
    public LikeResponse isTrackLiked(Track track) {
        final Set<Track> tracks = getAccount().getLikedTracks();
        return new LikeResponse(tracks.contains(track), track.getLikes().size());
    }

    @Override
    public LikeResponse isAlbumLiked(String albumId) {
        final Album album = albumRepository.findById(albumId).orElse(null);
        return isAlbumLiked(album);
    }

    @Override
    public LikeResponse isAlbumLiked(Album album) {
        final Set<Album> albums = getAccount().getLikedAlbums();
        return new LikeResponse(albums.contains(album), album.getLikes().size());
    }

    @Override
    public LikeResponse isTrackListLiked(String trackListId) {
        final TrackList trackList = trackListRepository.findById(trackListId).orElse(null);
        return isTrackListLiked(trackList);
    }

    @Override
    public LikeResponse isTrackListLiked(TrackList trackList) {
        final Set<TrackList> trackLists = getAccount().getLikedTrackLists();
        return new LikeResponse(trackLists.contains(trackList), trackList.getLikes().size());
    }

    private User getAccount() {
        return accountService.authorization();
    }

}
