package com.musicapp.musicApp.data.model.user;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "user_tokens")
@Getter@Setter
public class UserToken {

    @Id
    @Column(length = 32)
    private String id;

    @Column(nullable = false, name = "access_token")
    private String accessToken;

    @Column(nullable = false, name = "refresh_token")
    private String refreshToken;

    @OneToOne(mappedBy = "token")
    private User user;

}
