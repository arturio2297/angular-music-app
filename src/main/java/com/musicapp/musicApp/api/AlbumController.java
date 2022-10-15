package com.musicapp.musicApp.api;

import com.musicapp.musicApp.core.ApplicationException;
import com.musicapp.musicApp.core.contracts.AlbumService;
import com.musicapp.musicApp.core.message.album.*;
import com.musicapp.musicApp.core.message.common.FileResponse;
import com.musicapp.musicApp.core.message.common.LikeResponse;
import com.musicapp.musicApp.core.message.common.PageResponse;
import com.musicapp.musicApp.core.message.track.TrackAlbumFilterParameters;
import com.musicapp.musicApp.core.message.track.TrackItem;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping(value = "/api/v1/albums")
@RequiredArgsConstructor
public class AlbumController {

    private final AlbumService albumService;

    @GetMapping
    public PageResponse<AlbumItem> list(AlbumFilterParameters parameters) {
        return albumService.list(parameters);
    }

    @GetMapping(value = "/tracks")
    public PageResponse<TrackItem> tracks(TrackAlbumFilterParameters parameters) {
        return albumService.tracks(parameters);
    }

    @GetMapping(value = "/{id}")
    public AlbumResponse get(@PathVariable String id) throws ApplicationException {
        return albumService.get(id);
    }

    @GetMapping(value = "/{id}/image")
    public ResponseEntity<Resource> getImage(@PathVariable String id) throws ApplicationException, IOException {
        final FileResponse response = albumService.getImage(id);

        return response == null ?
                ResponseEntity.notFound().build()
                :
                ResponseEntity.ok()
                        .contentType(MediaType.valueOf(response.getContentType()))
                        .body(response.getResource());
    }

    @PostMapping(consumes = "multipart/form-data")
    @Transactional
    public AlbumResponse add(
            @RequestPart AddAlbumRequest request,
            @RequestPart(required = false) MultipartFile image
            ) throws ApplicationException, IOException {
        return albumService.add(request, image);
    }

    @PostMapping(
            value = "/{id}",
            consumes = "multipart/form-data"
    )
    @Transactional
    public AlbumResponse update(
            @PathVariable String id,
            @RequestPart UpdateAlbumRequest request,
            @RequestPart(required = false) MultipartFile image
    ) throws ApplicationException, IOException {
        return albumService.update(id, request, image);
    }

    @DeleteMapping(value = "/{id}")
    @Transactional
    public void delete(@PathVariable String id) throws ApplicationException {
        albumService.delete(id);
    }

    @GetMapping(value = "/check/name")
    public boolean checkName(
            @RequestParam String name,
            @RequestParam String groupId,
            @RequestParam(required = false) String albumId
    ) {
        return albumService.checkExistsByName(name, groupId, albumId);
    }

    @PutMapping(value = "/like/{id}")
    public LikeResponse like(@PathVariable String id) throws ApplicationException {
        return albumService.like(id);
    }

    @PutMapping(value = "/save/{id}")
    public boolean save(@PathVariable String id) throws ApplicationException {
        return albumService.save(id);
    }

}
