package com.musicapp.musicApp.core.contracts;

import com.musicapp.musicApp.core.ApplicationException;
import com.musicapp.musicApp.core.message.common.FileResponse;
import com.musicapp.musicApp.core.message.common.LikeResponse;
import com.musicapp.musicApp.core.message.common.PageResponse;
import com.musicapp.musicApp.core.message.track.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface TrackService {
    PageResponse<TrackItem> list(TrackFilterParameters parameters);
    TrackItem get(String id) throws ApplicationException;
    FileResponse getAudio(String id) throws IOException, ApplicationException;
    TrackItem add(AddTrackRequest request, MultipartFile audio) throws ApplicationException, IOException;
    TrackItem update(String id, UpdateTrackRequest request, MultipartFile audio) throws ApplicationException, IOException;
    boolean checkExistsByName(String name, String albumId, String trackId);
    LikeResponse like(String id) throws ApplicationException;
    boolean save(String id) throws ApplicationException;
    void delete(String id) throws ApplicationException;
}
