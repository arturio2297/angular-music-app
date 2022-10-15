package com.musicapp.musicApp.services.registration;

import com.musicapp.musicApp.core.ApplicationException;
import com.musicapp.musicApp.core.contracts.RegistrationService;
import com.musicapp.musicApp.core.contracts.TrackListService;
import com.musicapp.musicApp.core.message.error.ErrorCode;
import com.musicapp.musicApp.core.message.registration.RegistrationRequest;
import com.musicapp.musicApp.data.model.EntityStatus;
import com.musicapp.musicApp.data.model.track_list.TrackList;
import com.musicapp.musicApp.data.model.user.User;
import com.musicapp.musicApp.data.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegistrationServiceImpl implements RegistrationService {

    private final TrackListService trackListService;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final RegistrationMapper registrationMapper;

    @Override
    public void register(RegistrationRequest request) throws ApplicationException {
        final User existedByEmail = userRepository.findByEmailAndEntityStatus(request.getEmail(), EntityStatus.ACTIVE)
                .orElse(null);
        final User existedByUsername = userRepository.findByUsernameAndEntityStatus(request.getUsername(), EntityStatus.ACTIVE)
                .orElse(null);

        if (existedByEmail != null || existedByUsername != null)
            throw new ApplicationException(ErrorCode.USER_ALREADY_EXISTS);

        final User user = registrationMapper.merge(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

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

    @Override
    public boolean checkExistsByEmail(String email) {
        return userRepository.findByEmailAndEntityStatus(email, EntityStatus.ACTIVE).isPresent();
    }

    @Override
    public boolean checkExistsByUsername(String username) {
        return userRepository.findByUsernameAndEntityStatus(username, EntityStatus.ACTIVE).isPresent();
    }

}
