package com.musicapp.musicApp.services.album;

import com.musicapp.musicApp.core.contracts.LikeService;
import com.musicapp.musicApp.core.contracts.SaveService;
import com.musicapp.musicApp.core.message.album.AddAlbumRequest;
import com.musicapp.musicApp.core.message.album.AlbumResponse;
import com.musicapp.musicApp.core.message.album.AlbumItem;
import com.musicapp.musicApp.core.message.album.UpdateAlbumRequest;
import com.musicapp.musicApp.core.message.common.LikeResponse;
import com.musicapp.musicApp.core.message.track.TrackItem;
import com.musicapp.musicApp.data.model.EntityBase;
import com.musicapp.musicApp.data.model.album.Album;
import com.musicapp.musicApp.data.view.track.TrackAlbumView;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AlbumMapper {

    private final LikeService likeService;
    private final SaveService saveService;

    public AlbumItem map(Album album) {
        final AlbumItem item = new AlbumItem();

        item.setId(album.getId());
        item.setName(album.getName());

        final LikeResponse likeResponse = likeService.isAlbumLiked(album);

        item.setLiked(likeResponse.isLiked());
        item.setLikesCount(likeResponse.getLikesCount());

        item.setSaved(saveService.isAlbumSaved(album));
        item.setReleasedAt(album.getReleasedAt());
        item.setGroupId(album.getGroup().getId());
        item.setGroupName(album.getGroup().getName());
        item.setListening(album.getListening());
        item.setTracksCount(album.getTracksCount());

        return item;
    }

    public List<AlbumItem> map(List<Album> albums) {
        return albums.stream().map(this::map).collect(Collectors.toList());
    }

    public TrackItem mapTrack(TrackAlbumView view) {
        final TrackItem item = new TrackItem();

        item.setId(view.getId());
        item.setName(view.getName());

        final LikeResponse likeResponse = likeService.isTrackLiked(view.getId());

        item.setLiked(likeResponse.isLiked());
        item.setLikesCount(likeResponse.getLikesCount());

        item.setSaved(saveService.isTrackSaved(view.getId()));
        item.setFilename(view.getAudioFilename());
        item.setGenre(view.getGenre());
        item.setGroupId(view.getGroupId());
        item.setGroupName(view.getGroupName());
        item.setAlbumId(view.getAlbumId());
        item.setAlbumName(view.getAlbumName());
        item.setOrder(view.getOrder());

        return item;
    }

    public List<TrackItem> mapTrack(List<TrackAlbumView> views) {
        return views.stream().map(this::mapTrack).collect(Collectors.toList());
    }

    public void merge(Album album, AlbumResponse response) {

        response.setId(album.getId());
        response.setName(album.getName());

        final LikeResponse likeResponse = likeService.isAlbumLiked(album);

        response.setLiked(likeResponse.isLiked());
        response.setLikesCount(likeResponse.getLikesCount());

        response.setSaved(saveService.isAlbumSaved(album));
        response.setReleasedAt(album.getReleasedAt());
        response.setGroupId(album.getGroup().getId());
        response.setGroupName(album.getGroup().getName());
        response.setGenres(
                album.getGenres().stream()
                .map(EntityBase::getName)
                .collect(Collectors.toList())
        );
        response.setListening(album.getListening());
        response.setTracksCount(album.getTracksCount());

    }

    public void merge(Album album, AddAlbumRequest request) {
        album.setName(request.getName());
        album.setReleasedAt(request.getReleasedAt());
    }

    public void merge(Album album, UpdateAlbumRequest request) {
        album.setName(request.getName());
        album.setReleasedAt(request.getReleasedAt());
    }

}
