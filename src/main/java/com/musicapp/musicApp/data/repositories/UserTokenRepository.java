package com.musicapp.musicApp.data.repositories;

import com.musicapp.musicApp.data.model.user.UserToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserTokenRepository extends JpaRepository<UserToken, String> {
}