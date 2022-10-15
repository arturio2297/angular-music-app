package com.musicapp.musicApp.services.save;

import com.musicapp.musicApp.core.contracts.AccountService;
import com.musicapp.musicApp.core.contracts.SaveService;
import com.musicapp.musicApp.core.contracts.TrackOrderService;
import com.musicapp.musicApp.data.model.album.Album;
import com.musicapp.musicApp.data.model.track.Track;
import com.musicapp.musicApp.data.model.track_list.TrackList;
import com.musicapp.musicApp.data.model.track_order.TrackListType;
import com.musicapp.musicApp.data.model.track_order.TrackOrderId;
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
public class SaveServiceImpl implements SaveService {

    private final AccountService accountService;
    private final TrackOrderService orderService;
    private final UserRepository userRepository;
    private final TrackRepository trackRepository;
    private final AlbumRepository albumRepository;
    private final TrackListRepository trackListRepository;

    @Override
    public boolean save(Track track) {
        final TrackList trackList = trackListRepository.findPrivate(getAccount().getId());
        final Set<Track> tracks = trackList.getTracks();
        boolean saved = true;

        if (tracks.contains(track)) {
            tracks.remove(track);
            orderService.updateOrder(new TrackOrderId(
                    track.getId(),
                    trackList.getId()
            ));
            saved = false;
        } else {
            tracks.add(track);
            orderService.order(new TrackOrderId(
                    track.getId(),
                    trackList.getId()
            ), TrackListType.TrackList);
        }

        trackListRepository.save(trackList);
        return saved;
    }

    @Override
    public boolean save(Album album) {
        final User user = getAccount();
        final Set<Album> albums = user.getAlbums();

        boolean saved = true;

        if (albums.contains(album)) {
            albums.remove(album);
            saved = false;
        } else {
            albums.add(album);
        }

        userRepository.save(user);
        return saved;
    }

    @Override
    public boolean save(TrackList trackList) {
        final User user = getAccount();
        final Set<TrackList> trackLists = user.getTrackLists();

        boolean saved = true;

        if (trackLists.contains(trackList)) {
            trackLists.remove(trackList);
            saved = false;
        } else {
            trackLists.add(trackList);
        }

        userRepository.save(user);
        return saved;
    }

    @Override
    public boolean isTrackSaved(String trackId) {
        final Track track = trackRepository.findById(trackId).orElse(null);
        return isTrackSaved(track);
    }

    @Override
    public boolean isTrackSaved(Track track) {
        final TrackList trackList = trackListRepository.findPrivate(getAccount().getId());
        return trackList.getTracks().contains(track);
    }

    @Override
    public boolean isAlbumSaved(String albumId) {
        final Album album = albumRepository.findById(albumId).orElse(null);
        return isAlbumSaved(album);
    }

    @Override
    public boolean isAlbumSaved(Album album) {
        return getAccount().getAlbums().contains(album);
    }

    @Override
    public boolean isTrackListSaved(String trackListId) {
        final TrackList trackList = trackListRepository.findById(trackListId).orElse(null);
        return isTrackListSaved(trackList);
    }

    @Override
    public boolean isTrackListSaved(TrackList trackList) {
        return getAccount().getTrackLists().contains(trackList);
    }

    private User getAccount() {
        return accountService.authorization();
    }
}
