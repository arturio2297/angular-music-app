package com.musicapp.musicApp.data.model.user;

import com.musicapp.musicApp.data.model.EntityBase;
import com.musicapp.musicApp.data.model.album.Album;
import com.musicapp.musicApp.data.model.track.Track;
import com.musicapp.musicApp.data.model.track_list.TrackList;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter@Setter
public class User extends EntityBase {

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, length = 32)
    private String username;

    @Column(length = 32)
    private String firstname;

    @Column(length = 32)
    private String lastname;

    @Column(name = "avatar_filename")
    private String avatarFilename;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    @OneToOne(cascade = CascadeType.ALL)
    private UserToken token;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "users_liked_tracks",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "track_id")
    )
    Set<Track> likedTracks = new HashSet<>();

    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinTable(
            name = "users_track_lists",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "track_list_id")
    )
    Set<TrackList> trackLists = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "users_liked_track_lists",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "track_list_id")
    )
    Set<TrackList> likedTrackLists = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "users_albums",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "album_id")
    )
    Set<Album> albums = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "users_liked_albums",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "album_id")
    )
    Set<Album> likedAlbums = new HashSet<>();

    public TrackList getPrivateTrackList() {
        return trackLists.stream()
                .filter(TrackList::isPrivate)
                .findFirst()
                .orElse(null);
    }

    public boolean isAdmin() {
        return StringUtils.equals(role, UserRole.ADMIN);
    }

    public boolean isModerator() {
        return StringUtils.equals(role, UserRole.MODERATOR);
    }

    public boolean isUser() {
        return StringUtils.equals(role, UserRole.USER);
    }

}
