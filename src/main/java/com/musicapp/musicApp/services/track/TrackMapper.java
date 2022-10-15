package com.musicapp.musicApp.services.track;

import com.musicapp.musicApp.core.contracts.LikeService;
import com.musicapp.musicApp.core.contracts.SaveService;
import com.musicapp.musicApp.core.message.common.LikeResponse;
import com.musicapp.musicApp.core.message.track.AddTrackRequest;
import com.musicapp.musicApp.core.message.track.TrackItem;
import com.musicapp.musicApp.core.message.track.UpdateTrackRequest;
import com.musicapp.musicApp.data.model.track.Track;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class TrackMapper {

    private final LikeService likeService;
    private final SaveService saveService;

    public TrackItem map(Track track) {
        final TrackItem item = new TrackItem();

        item.setId(track.getId());
        item.setName(track.getName());

        final LikeResponse likeResponse = likeService.isTrackLiked(track);

        item.setLiked(likeResponse.isLiked());
        item.setLikesCount(likeResponse.getLikesCount());

        item.setSaved(saveService.isTrackSaved(track));
        item.setFilename(track.getAudioFilename());
        item.setGenre(track.getGenre().getName());
        item.setGroupId(track.getAlbum().getGroup().getId());
        item.setGroupName(track.getAlbum().getGroup().getName());
        item.setAlbumId(track.getAlbum().getId());
        item.setAlbumName(track.getAlbum().getName());

        return item;
    }

    public List<TrackItem> map(List<Track> tracks) {
        return tracks.stream().map(this::map).collect(Collectors.toList());
    }

    public void merge(Track track, AddTrackRequest request) {
        track.setName(request.getName());
    }

    public void merge(Track track, UpdateTrackRequest request) {
        track.setName(request.getName());
    }

}
