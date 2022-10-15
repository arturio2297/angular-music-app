package com.musicapp.musicApp.core.contracts;

import com.musicapp.musicApp.core.ApplicationException;
import com.musicapp.musicApp.core.message.album.*;
import com.musicapp.musicApp.core.message.common.FileResponse;
import com.musicapp.musicApp.core.message.common.LikeResponse;
import com.musicapp.musicApp.core.message.common.PageResponse;
import com.musicapp.musicApp.core.message.track.TrackAlbumFilterParameters;
import com.musicapp.musicApp.core.message.track.TrackItem;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface AlbumService {
    PageResponse<AlbumItem> list(AlbumFilterParameters parameters);
    PageResponse<TrackItem> tracks(TrackAlbumFilterParameters parameters);
    AlbumResponse get(String id) throws ApplicationException;
    FileResponse getImage(String id) throws ApplicationException, IOException;
    AlbumResponse add(AddAlbumRequest request, MultipartFile image) throws ApplicationException, IOException;
    AlbumResponse update(String id, UpdateAlbumRequest request, MultipartFile image) throws ApplicationException, IOException;
    boolean checkExistsByName(String name, String groupId, String albumId);
    LikeResponse like(String id) throws ApplicationException;
    boolean save(String id) throws ApplicationException;
    void delete(String id) throws ApplicationException;
}
