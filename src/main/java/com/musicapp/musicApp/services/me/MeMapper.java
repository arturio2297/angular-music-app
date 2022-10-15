package com.musicapp.musicApp.services.me;

import com.musicapp.musicApp.core.contracts.LikeService;
import com.musicapp.musicApp.core.contracts.SaveService;
import com.musicapp.musicApp.core.message.album.AlbumItem;
import com.musicapp.musicApp.core.message.common.LikeResponse;
import com.musicapp.musicApp.core.message.track_list.TrackListItem;
import com.musicapp.musicApp.data.view.album.AlbumUserView;
import com.musicapp.musicApp.data.view.track_list.TrackListUserView;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class MeMapper {

    private final LikeService likeService;
    private final SaveService saveService;

    public AlbumItem mapAlbum(AlbumUserView view) {
        final AlbumItem item = new AlbumItem();

        item.setId(view.getId());
        item.setName(view.getName());

        final LikeResponse likeResponse = likeService.isAlbumLiked(view.getId());

        item.setLiked(likeResponse.isLiked());
        item.setLikesCount(likeResponse.getLikesCount());

        item.setSaved(saveService.isAlbumSaved(view.getId()));
        item.setReleasedAt(view.getReleasedAt());
        item.setGroupId(view.getGroupId());
        item.setGroupName(view.getGroupName());
        item.setListening(view.getListening());
        item.setTracksCount(view.getTracksCount());

        return item;
    }

    public List<AlbumItem> mapAlbum(List<AlbumUserView> views) {
        return views.stream().map(this::mapAlbum).collect(Collectors.toList());
    }

    public TrackListItem mapTrackList(TrackListUserView view) {
        final TrackListItem item = new TrackListItem();

        item.setId(view.getId());
        item.setName(view.getName());
        item.setAuthorId(view.getAuthorId());
        item.setAuthorUsername(view.getAuthorUsername());

        final LikeResponse likeResponse = likeService.isTrackListLiked(view.getId());

        item.setLiked(likeResponse.isLiked());
        item.setLikesCount(likeResponse.getLikesCount());
        item.setSaved(saveService.isTrackListSaved(view.getId()));
        item.setListening(view.getListening());
        item.setTracksCount(view.getTracksCount());

        return item;
    }

    public List<TrackListItem> mapTrackList(List<TrackListUserView> trackLists) {
        return trackLists.stream().map(this::mapTrackList).collect(Collectors.toList());
    }

}
