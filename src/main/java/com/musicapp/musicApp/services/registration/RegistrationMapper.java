package com.musicapp.musicApp.services.registration;

import com.musicapp.musicApp.core.message.registration.RegistrationRequest;
import com.musicapp.musicApp.data.model.EntityStatus;
import com.musicapp.musicApp.data.model.user.User;
import com.musicapp.musicApp.data.model.user.UserRole;
import com.musicapp.musicApp.utils.IdUtils;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

@Component
public class RegistrationMapper {

    public User merge(RegistrationRequest request) {
        final User user = new User();

        user.setId(IdUtils.newId());
        user.setEntityStatus(EntityStatus.ACTIVE);
        user.setCreatedAt(OffsetDateTime.now());
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setRole(UserRole.USER);

        return user;
    }

}
