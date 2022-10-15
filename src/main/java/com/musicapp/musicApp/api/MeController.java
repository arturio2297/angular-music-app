package com.musicapp.musicApp.api;

import com.musicapp.musicApp.core.contracts.MeService;
import com.musicapp.musicApp.core.message.album.AlbumItem;
import com.musicapp.musicApp.core.message.album.UserAlbumFilterParameters;
import com.musicapp.musicApp.core.message.common.PageResponse;
import com.musicapp.musicApp.core.message.track.TrackItem;
import com.musicapp.musicApp.core.message.track.UserTrackFilterParameters;
import com.musicapp.musicApp.core.message.track_list.TrackListItem;
import com.musicapp.musicApp.core.message.track_list.UserTrackListFilterParameters;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/me")
@RequiredArgsConstructor
public class MeController {

    private final MeService meService;

    @GetMapping(value = "/albums")
    public PageResponse<AlbumItem> albums(UserAlbumFilterParameters parameters) {
        return meService.albums(parameters);
    }

    @GetMapping(value = "/track-lists")
    public PageResponse<TrackListItem> trackLists(UserTrackListFilterParameters parameters) {
        return meService.trackLists(parameters);
    }

    @GetMapping(value = "/tracks")
    public PageResponse<TrackItem> tracks(UserTrackFilterParameters parameters) {
        return meService.tracks(parameters);
    }

}
