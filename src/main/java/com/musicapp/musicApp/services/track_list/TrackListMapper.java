package com.musicapp.musicApp.services.track_list;

import com.musicapp.musicApp.core.contracts.LikeService;
import com.musicapp.musicApp.core.contracts.SaveService;
import com.musicapp.musicApp.core.message.common.LikeResponse;
import com.musicapp.musicApp.core.message.track.TrackItem;
import com.musicapp.musicApp.core.message.track_list.AddTrackListRequest;
import com.musicapp.musicApp.core.message.track_list.TrackListItem;
import com.musicapp.musicApp.core.message.track_list.TrackListResponse;
import com.musicapp.musicApp.core.message.track_list.UpdateTrackListRequest;
import com.musicapp.musicApp.data.model.EntityBase;
import com.musicapp.musicApp.data.model.track_list.TrackList;
import com.musicapp.musicApp.data.view.track.TrackTrackListView;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class TrackListMapper {

    private final LikeService likeService;
    private final SaveService saveService;

    public TrackListItem map(TrackList trackList) {
        final TrackListItem item = new TrackListItem();

        item.setId(trackList.getId());
        item.setName(trackList.getName());
        item.setAuthorId(trackList.getCreatedBy().getId());
        item.setAuthorUsername(trackList.getCreatedBy().getUsername());

        final LikeResponse likeResponse = likeService.isTrackListLiked(trackList.getId());

        item.setLiked(likeResponse.isLiked());
        item.setLikesCount(likeResponse.getLikesCount());

        item.setSaved(saveService.isTrackListSaved(trackList.getId()));
        item.setListening(trackList.getListening());
        item.setTracksCount(trackList.getTracksCount());

        return item;
    }

    public List<TrackListItem> map(List<TrackList> trackLists) {
        return trackLists.stream().map(this::map).collect(Collectors.toList());
    }

    public TrackItem mapTrack(TrackTrackListView view) {
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
        item.setTrackListId(view.getTrackListId());
        item.setTrackListName(view.getTrackListName());
        item.setOrder(view.getOrder());

        return item;
    }

    public List<TrackItem> mapTrack(List<TrackTrackListView> views) {
        return views.stream().map(this::mapTrack).collect(Collectors.toList());
    }

    public void merge(TrackList trackList, AddTrackListRequest request) {
        trackList.setName(request.getName());
    }

    public void  merge(TrackList trackList, UpdateTrackListRequest request) {
        trackList.setName(request.getName());
    }

    public void merge(TrackList trackList, TrackListResponse response) {

        response.setId(trackList.getId());
        response.setName(trackList.getName());
        response.setAuthorId(trackList.getCreatedBy().getId());

        final LikeResponse likeResponse = likeService.isTrackListLiked(trackList);

        response.setLiked(likeResponse.isLiked());
        response.setLikesCount(likeResponse.getLikesCount());

        response.setSaved(saveService.isTrackListSaved(trackList));
        response.setGenres(trackList.getGenres()
                .stream()
                .map(EntityBase::getName)
                .collect(Collectors.toList())
        );
        response.setListening(trackList.getListening());
        response.setTracksCount(trackList.getTracksCount());
    }
}
