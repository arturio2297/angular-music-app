package com.musicapp.musicApp.services.user;

import com.musicapp.musicApp.configuration.application.ApplicationAdmin;
import com.musicapp.musicApp.core.ApplicationException;
import com.musicapp.musicApp.core.contracts.TrackListService;
import com.musicapp.musicApp.core.contracts.UserService;
import com.musicapp.musicApp.data.model.EntityStatus;
import com.musicapp.musicApp.data.model.track_list.TrackList;
import com.musicapp.musicApp.data.model.user.User;
import com.musicapp.musicApp.data.model.user.UserRole;
import com.musicapp.musicApp.data.repositories.UserRepository;
import com.musicapp.musicApp.utils.IdUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final TrackListService trackListService;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void init(ApplicationAdmin admin) {
        User existed = userRepository.getByEmail(admin.getEmail());

        if (existed == null) {
            final User user = new User();

            user.setId(IdUtils.newId());
            user.setEntityStatus(EntityStatus.ACTIVE);
            user.setCreatedAt(OffsetDateTime.now());

            user.setEmail(admin.getEmail());
            user.setPassword(passwordEncoder.encode(admin.getPassword()));
            user.setRole(UserRole.ADMIN);
            user.setUsername(admin.getUsername());
            user.setFirstname(admin.getFirstname());
            user.setLastname(admin.getLastname());

            try {
                final TrackList trackList = trackListService.createPrivate(user);
                user.setTrackLists(new HashSet<TrackList>(){{
                    add(trackList);
                }});
                userRepository.save(user);
            } catch (ApplicationException exception) {
                log.error("Track list already exists", exception);
            }

            userRepository.save(user);
        }
    }

}
