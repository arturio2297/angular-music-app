package com.musicapp.musicApp.api;

import com.musicapp.musicApp.core.ApplicationException;
import com.musicapp.musicApp.core.contracts.GroupService;
import com.musicapp.musicApp.core.message.common.FileResponse;
import com.musicapp.musicApp.core.message.common.PageResponse;
import com.musicapp.musicApp.core.message.group.*;
import com.musicapp.musicApp.core.message.track.TrackGroupFilterParameters;
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
@RequestMapping("/api/v1/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    @GetMapping
    public PageResponse<GroupItem> list(GroupFilterParameters parameters) {
        return groupService.list(parameters);
    }

    @GetMapping(value = "/tracks")
    public PageResponse<TrackItem> tracks(TrackGroupFilterParameters parameters) {
        return groupService.tracks(parameters);
    }

    @GetMapping(value = "/{id}")
    public GroupResponse get(@PathVariable String id) throws ApplicationException {
        return groupService.get(id);
    }

    @GetMapping(value = "/{id}/image")
    public ResponseEntity<Resource> getImage(@PathVariable String id) throws ApplicationException, IOException {
        final FileResponse response = groupService.getImage(id);

        return response == null ?
                ResponseEntity.notFound().build()
                :
                ResponseEntity.ok()
                        .contentType(MediaType.valueOf(response.getContentType()))
                        .body(response.getResource());
    }

    @PostMapping(consumes = "multipart/form-data")
    @Transactional
    public GroupResponse add(
            @RequestPart(name = "request") AddGroupRequest request,
            @RequestPart(name = "image", required = false) MultipartFile image
    ) throws ApplicationException, IOException {
        return groupService.add(request, image);
    }

    @PostMapping(
            value = "/{id}",
            consumes = "multipart/form-data"
    )
    @Transactional
    public GroupResponse update(
            @PathVariable String id,
            @RequestPart(name = "request") UpdateGroupRequest request,
            @RequestPart(name = "image", required = false) MultipartFile image
    ) throws ApplicationException, IOException {
        return groupService.update(id, request, image);
    }

    @DeleteMapping(value = "/{id}")
    @Transactional
    public void delete(@PathVariable String id) throws ApplicationException {
        groupService.delete(id);
    }

    @GetMapping(value = "/check/name")
    public boolean checkName(@RequestParam String name, @RequestParam(required = false) String id) {
        return groupService.checkExistsByName(name, id);
    }

}
