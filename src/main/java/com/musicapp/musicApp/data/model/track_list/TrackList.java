package com.musicapp.musicApp.data.model.track_list;

import com.musicapp.musicApp.data.model.EntityBase;
import com.musicapp.musicApp.data.model.Genre;
import com.musicapp.musicApp.data.model.track.Track;
import com.musicapp.musicApp.data.model.user.User;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(name = "track_lists")
@Getter@Setter
public class TrackList extends EntityBase {

    @Column(name = "is_private", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean isPrivate;

    @Column(name = "image_filename")
    private String imageFilename;

    @Column(columnDefinition = "BIGINT DEFAULT 0")
    private long listening;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User createdBy;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "track_list_tracks",
            joinColumns = @JoinColumn(name = "track_list_id"),
            inverseJoinColumns = @JoinColumn(name = "track_id")
    )
    private Set<Track> tracks = new HashSet<>();

    @ManyToMany(mappedBy = "likedTrackLists")
    private Set<User> likes = new HashSet<>();

    public List<Genre> getGenres() {
        return tracks.stream()
                .map(Track::getGenre)
                .distinct()
                .collect(Collectors.toList());
    }

    public List<String> getTracksIds() {
        return tracks.stream()
                .map(EntityBase::getId)
                .collect(Collectors.toList());
    }

    public int getTracksCount() {
        return (int) tracks.stream()
                .filter(EntityBase::isActive)
                .count();
    }

}
