package com.musicapp.musicApp.services.account;

import com.musicapp.musicApp.configuration.application.ApplicationConfiguration;
import com.musicapp.musicApp.core.ApplicationException;
import com.musicapp.musicApp.core.contracts.AccountService;
import com.musicapp.musicApp.core.message.account.AccountResponse;
import com.musicapp.musicApp.core.message.account.UpdateAccountRequest;
import com.musicapp.musicApp.core.message.common.FileRequest;
import com.musicapp.musicApp.core.message.common.FileResponse;
import com.musicapp.musicApp.core.message.error.ErrorCode;
import com.musicapp.musicApp.data.model.EntityStatus;
import com.musicapp.musicApp.data.model.user.User;
import com.musicapp.musicApp.data.repositories.UserRepository;
import com.musicapp.musicApp.utils.Base64Utils;
import com.musicapp.musicApp.utils.IdUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.io.UrlResource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountServiceImpl implements AccountService {

    private final ApplicationConfiguration applicationConfiguration;
    private final UserRepository userRepository;
    private final AccountMapper accountMapper;

    @Override
    public User authorization() {
        final String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmailAndEntityStatus(email, EntityStatus.ACTIVE).orElse(null);
    }

    @Override
    public AccountResponse get() {
        return accountMapper.map(authorization());
    }

    @Override
    public FileResponse getAvatar(String id) throws ApplicationException, IOException {
        final User user = userRepository.findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
                .orElseThrow(() -> new ApplicationException(ErrorCode.NOT_FOUND));

        if (user.getAvatarFilename() == null)
            throw new ApplicationException(ErrorCode.NOT_FOUND);

        final Path path = Paths.get(applicationConfiguration.getImagesPath()).resolve(user.getAvatarFilename());
        final FileResponse response = new FileResponse();

        response.setResource(new UrlResource(path.toUri().toURL()));
        response.setContentType(Files.probeContentType(path));

        return response;
    }

    @Override
    public AccountResponse update(UpdateAccountRequest request, MultipartFile avatar) throws ApplicationException, IOException {
        final User user = authorization();
        final User existed = userRepository.findByUsernameAndEntityStatus(request.getUsername(), EntityStatus.ACTIVE)
                .orElse(null);

        if (existed != null && !StringUtils.equals(existed.getId(), user.getId()))
            throw new ApplicationException(ErrorCode.USER_ALREADY_EXISTS);

        accountMapper.merge(user, request);
        setAvatar(user, request.getAvatar(), avatar);

        userRepository.save(user);

        return accountMapper.map(user);
    }

    private void setAvatar(User user, FileRequest request, MultipartFile image) throws IOException {
        if (request == null && image == null) return;

        final String filename = image != null ? image.getOriginalFilename() : request.getFilename();
        final byte[] content = image != null ? image.getBytes() : Base64Utils.encode(request.getBase64());

        final String avatarFilename = IdUtils.newId() + "-" + filename;
        user.setAvatarFilename(avatarFilename);
        final Path path = Paths.get(applicationConfiguration.getImagesPath()).resolve(avatarFilename);
        Files.write(path, content);
    }

    @Override
    public boolean checkExistsByUsername(String username) {
        final User account = authorization();
        final User existed = userRepository.findByUsernameAndEntityStatus(username, EntityStatus.ACTIVE)
                .orElse(null);
        return (existed != null && !StringUtils.equals(existed.getId(), account.getId()));
    }

    @Override
    public boolean checkExistsByEmail(String email) {
        final User account = authorization();
        final User existed = userRepository.findByEmailAndEntityStatus(email, EntityStatus.ACTIVE)
                .orElse(null);
        return (existed != null && !StringUtils.equals(existed.getId(), account.getId()));
    }

}
