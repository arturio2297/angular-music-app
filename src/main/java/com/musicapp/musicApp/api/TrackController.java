package com.musicapp.musicApp.api;

import com.musicapp.musicApp.core.ApplicationException;
import com.musicapp.musicApp.core.contracts.TrackService;
import com.musicapp.musicApp.core.message.common.FileResponse;
import com.musicapp.musicApp.core.message.common.LikeResponse;
import com.musicapp.musicApp.core.message.common.PageResponse;
import com.musicapp.musicApp.core.message.track.*;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping(value = "/api/v1/tracks")
@RequiredArgsConstructor
public class TrackController {

    private final TrackService trackService;

    @GetMapping()
    public PageResponse<TrackItem> list(TrackFilterParameters parameters) {
        return trackService.list(parameters);
    }

    @GetMapping(value = "/{id}")
    public TrackItem get(@PathVariable String id) throws ApplicationException {
        return trackService.get(id);
    }

    @PostMapping(consumes = "multipart/form-data")
    @Transactional
    public TrackItem add(
            @RequestPart AddTrackRequest request,
            @RequestPart MultipartFile audio
    ) throws ApplicationException, IOException {
        return trackService.add(request, audio);
    }

    @PostMapping(
            value = "/{id}",
            consumes = "multipart/form-data"
    )
    @Transactional
    public TrackItem update(
            @PathVariable String id,
            @RequestPart UpdateTrackRequest request,
            @RequestPart(required = false) MultipartFile audio
            ) throws ApplicationException, IOException {
        return trackService.update(id, request, audio);
    }

    @DeleteMapping(value = "/{id}")
    public void delete(@PathVariable String id) throws ApplicationException {
        this.trackService.delete(id);
    }

    @GetMapping(value = "/check/name")
    public boolean checkName(
            @RequestParam String name,
            @RequestParam String albumId,
            @RequestParam(required = false) String trackId
    ) {
        return trackService.checkExistsByName(name, albumId, trackId);
    }

    @PutMapping(value = "/like/{id}")
    public LikeResponse like(@PathVariable String id) throws ApplicationException {
        return trackService.like(id);
    }

    @PutMapping(value = "/save/{id}")
    @Transactional
    public boolean save(@PathVariable String id) throws ApplicationException {
        return trackService.save(id);
    }

    @GetMapping(value = "/{id}/audio")
    public ResponseEntity<Resource> getAudio(@PathVariable String id) throws IOException, ApplicationException {
        final FileResponse response = trackService.getAudio(id);

        return response == null ?
                ResponseEntity.notFound().build()
                :
                ResponseEntity.ok()
                        .cacheControl(CacheControl.noCache())
                        .contentType(MediaType.valueOf(response.getContentType()))
                        .body(response.getResource());
    }



}
