package com.musicapp.musicApp.api;

import com.musicapp.musicApp.core.ApplicationException;
import com.musicapp.musicApp.core.contracts.TrackListService;
import com.musicapp.musicApp.core.message.common.FileResponse;
import com.musicapp.musicApp.core.message.common.LikeResponse;
import com.musicapp.musicApp.core.message.common.PageResponse;
import com.musicapp.musicApp.core.message.track.TrackItem;
import com.musicapp.musicApp.core.message.track.TrackTrackListFilterParameters;
import com.musicapp.musicApp.core.message.track_list.*;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/track-lists")
@RequiredArgsConstructor
public class TrackListController {

    private final TrackListService trackListService;

    @GetMapping
    public PageResponse<TrackListItem> list(TrackListFilterParameters parameters) {
        return trackListService.list(parameters);
    }

    @GetMapping(value = "/tracks")
    public PageResponse<TrackItem> tracks(TrackTrackListFilterParameters parameters) {
        return trackListService.tracks(parameters);
    }

    @GetMapping(value = "/{id}")
    public TrackListResponse get(@PathVariable String id) throws ApplicationException {
        return trackListService.get(id);
    }

    @GetMapping(value = "/{id}/image")
    public ResponseEntity<Resource> getImage(@PathVariable String id) throws ApplicationException, IOException {
        final FileResponse response = trackListService.getImage(id);

        return response == null ?
                ResponseEntity.notFound().build()
                :
                ResponseEntity.ok()
                        .contentType(MediaType.valueOf(response.getContentType()))
                        .body(response.getResource());
    }

    @PostMapping(consumes = "multipart/form-data")
    @Transactional
    public TrackListResponse add(
            @RequestPart AddTrackListRequest request,
            @RequestPart(required = false) MultipartFile image
            ) throws ApplicationException, IOException {
        return trackListService.add(request, image);
    }

    @PostMapping(
            value = "/{id}",
            consumes = "multipart/form-data"
    )
    @Transactional
    public TrackListResponse update(
            @PathVariable String id,
            @RequestPart UpdateTrackListRequest request,
            @RequestPart(required = false) MultipartFile image
            ) throws ApplicationException, IOException {
        return trackListService.update(id, request, image);
    }

    @DeleteMapping(value = "/{id}")
    public void delete(@PathVariable String id) throws ApplicationException {
        trackListService.delete(id);
    }

    @GetMapping(value = "/check/name")
    public boolean checkName(@RequestParam String name, @RequestParam(required = false) String trackListId) {
        return trackListService.checkExistsByName(name, trackListId);
    }

    @PutMapping(value = "/like/{id}")
    public LikeResponse like(@PathVariable String id) throws ApplicationException {
        return trackListService.like(id);
    }

    @PutMapping(value = "/save/{id}")
    public boolean save(@PathVariable String id) throws ApplicationException {
        return trackListService.save(id);
    }

}
