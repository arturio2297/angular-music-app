package com.musicapp.musicApp.data.model.album;

import com.musicapp.musicApp.data.model.EntityBase;
import com.musicapp.musicApp.data.model.Genre;
import com.musicapp.musicApp.data.model.group.Group;
import com.musicapp.musicApp.data.model.track.Track;
import com.musicapp.musicApp.data.model.user.User;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(name = "albums")
@Getter@Setter
public class Album extends EntityBase {

    @Column(name = "released_at")
    private Date releasedAt;

    @Column(name = "image_filename")
    private String imageFilename;

    @Column(columnDefinition = "BIGINT DEFAULT 0")
    private long listening;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    @OneToMany(mappedBy = "album", fetch = FetchType.LAZY)
    private Set<Track> tracks = new HashSet<>();

    @ManyToMany(mappedBy = "likedAlbums")
    private Set<User> likes = new HashSet<>();

    public List<Genre> getGenres() {
        return tracks.stream()
                .map(Track::getGenre)
                .distinct()
                .collect(Collectors.toList());
    }

    public int getTracksCount() {
        return (int) tracks.stream()
                .filter(EntityBase::isActive)
                .count();
    }

}
