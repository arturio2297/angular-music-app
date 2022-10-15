package com.musicapp.musicApp.services.group;

import com.musicapp.musicApp.core.contracts.LikeService;
import com.musicapp.musicApp.core.contracts.SaveService;
import com.musicapp.musicApp.core.message.common.LikeResponse;
import com.musicapp.musicApp.core.message.group.AddGroupRequest;
import com.musicapp.musicApp.core.message.group.GroupResponse;
import com.musicapp.musicApp.core.message.group.GroupItem;
import com.musicapp.musicApp.core.message.group.UpdateGroupRequest;
import com.musicapp.musicApp.core.message.track.TrackItem;
import com.musicapp.musicApp.data.model.EntityBase;
import com.musicapp.musicApp.data.model.group.Group;
import com.musicapp.musicApp.data.view.track.TrackGroupView;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class GroupMapper {

    private final LikeService likeService;
    private final SaveService saveService;

    public GroupItem map(Group group) {
        final GroupItem item = new GroupItem();

        item.setId(group.getId());
        item.setName(group.getName());
        item.setAlbumsCount(group.getAlbumsCount());

        return item;
    }

    public List<GroupItem> map(List<Group> groups) {
        return groups.stream().map(this::map).collect(Collectors.toList());
    }

    public TrackItem mapTrack(TrackGroupView view) {
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

    public List<TrackItem> mapTrack(List<TrackGroupView> views) {
        return views.stream().map(this::mapTrack).collect(Collectors.toList());
    }

    public void merge(Group group, GroupResponse response) {
        response.setId(group.getId());
        response.setName(group.getName());
        response.setAdditionalInfo(group.getAdditionalInfo());
        response.setGenres(group.getGenres().stream().map(EntityBase::getName).collect(Collectors.toList()));
        response.setAlbumsCount(group.getAlbumsCount());
    }

    public void merge(Group group, AddGroupRequest request) {
        group.setName(request.getName());
        group.setAdditionalInfo(request.getAdditionalInfo());
    }

    public void merge(Group group, UpdateGroupRequest request) {
        group.setName(request.getName());
        group.setAdditionalInfo(request.getAdditionalInfo());
    }

}
