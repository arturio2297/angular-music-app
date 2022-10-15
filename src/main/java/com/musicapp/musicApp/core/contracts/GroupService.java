package com.musicapp.musicApp.core.contracts;

import com.musicapp.musicApp.core.ApplicationException;
import com.musicapp.musicApp.core.message.common.FileResponse;
import com.musicapp.musicApp.core.message.common.PageResponse;
import com.musicapp.musicApp.core.message.group.*;
import com.musicapp.musicApp.core.message.track.TrackGroupFilterParameters;
import com.musicapp.musicApp.core.message.track.TrackItem;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface GroupService {
    PageResponse<GroupItem> list(GroupFilterParameters parameters);
    PageResponse<TrackItem> tracks(TrackGroupFilterParameters parameters);
    GroupResponse get(String id) throws ApplicationException;
    FileResponse getImage(String id) throws ApplicationException, IOException;
    GroupResponse add(AddGroupRequest request, MultipartFile image) throws ApplicationException, IOException;
    GroupResponse update(String id, UpdateGroupRequest request, MultipartFile image) throws ApplicationException, IOException;
    void delete(String id) throws ApplicationException;
    boolean checkExistsByName(String name, String id);
}
