package com.musicapp.musicApp.core.contracts;

import com.musicapp.musicApp.core.ApplicationException;
import com.musicapp.musicApp.core.message.account.AccountResponse;
import com.musicapp.musicApp.core.message.account.UpdateAccountRequest;
import com.musicapp.musicApp.core.message.common.FileResponse;
import com.musicapp.musicApp.data.model.user.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface AccountService {
    User authorization();
    AccountResponse get();
    FileResponse getAvatar(String id) throws ApplicationException, IOException;
    AccountResponse update(UpdateAccountRequest request, MultipartFile avatar) throws ApplicationException, IOException;
    boolean checkExistsByUsername(String username);
    boolean checkExistsByEmail(String email);
}
