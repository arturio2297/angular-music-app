package com.musicapp.musicApp.services.account;

import com.musicapp.musicApp.core.message.account.AccountResponse;
import com.musicapp.musicApp.core.message.account.UpdateAccountRequest;
import com.musicapp.musicApp.data.model.user.User;
import org.springframework.stereotype.Component;

@Component
public class AccountMapper {

    public AccountResponse map(User user) {
        final AccountResponse response = new AccountResponse();

        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setUsername(user.getUsername());
        response.setFirstname(user.getFirstname());
        response.setLastname(user.getLastname());
        response.setRole(user.getRole());

        return response;
    }

    public void merge(User user, UpdateAccountRequest request) {
        user.setUsername(request.getUsername());
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
    }

}
