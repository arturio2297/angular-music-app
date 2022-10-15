package com.musicapp.musicApp.data.repositories;

import com.musicapp.musicApp.data.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    User getByEmail(String email);

    Optional<User> findByIdAndEntityStatus(String id, String entityStatus);

    Optional<User> findByEmailAndEntityStatus(String email, String entityStatus);

    Optional<User> findByUsernameAndEntityStatus(String username, String entityStatus);

    @Query("SELECT u FROM User u WHERE u.token.accessToken = ?1 OR u.token.refreshToken = ?1 AND u.email = ?2")
    Optional<User> findByTokenAndEmail(String token, String email);
}
