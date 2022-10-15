package com.musicapp.musicApp.core.contracts;

import com.musicapp.musicApp.core.ApplicationException;
import com.musicapp.musicApp.core.message.common.FileResponse;
import com.musicapp.musicApp.core.message.common.LikeResponse;
import com.musicapp.musicApp.core.message.common.PageResponse;
import com.musicapp.musicApp.core.message.track.TrackItem;
import com.musicapp.musicApp.core.message.track.TrackTrackListFilterParameters;
import com.musicapp.musicApp.core.message.track_list.*;
import com.musicapp.musicApp.data.model.track_list.TrackList;
import com.musicapp.musicApp.data.model.user.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface TrackListService {
    PageResponse<TrackListItem> list(TrackListFilterParameters parameters);
    PageResponse<TrackItem> tracks(TrackTrackListFilterParameters parameters);
    TrackListResponse get(String id) throws ApplicationException;
    FileResponse getImage(String id) throws ApplicationException, IOException;
    TrackListResponse add(AddTrackListRequest request, MultipartFile image) throws ApplicationException, IOException;
    TrackListResponse update(String id, UpdateTrackListRequest request, MultipartFile image) throws ApplicationException, IOException;
    TrackList createPrivate(User user) throws ApplicationException;
    boolean checkExistsByName(String name, String trackListId);
    LikeResponse like(String id) throws ApplicationException;
    boolean save(String id) throws ApplicationException;
    void delete(String id) throws ApplicationException;
}
