package com.musicapp.musicApp.data.model.track;

import com.musicapp.musicApp.data.model.EntityBase;
import com.musicapp.musicApp.data.model.Genre;
import com.musicapp.musicApp.data.model.album.Album;
import com.musicapp.musicApp.data.model.track_list.TrackList;
import com.musicapp.musicApp.data.model.user.User;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tracks")
@Getter@Setter
public class Track extends EntityBase {

    @Column(name = "audio_filename")
    private String audioFilename;

    @ManyToOne
    @JoinColumn(name = "genre_id", nullable = false)
    private Genre genre;

    @ManyToOne
    @JoinColumn(name = "album_id", nullable = false)
    private Album album;

    @ManyToMany(mappedBy = "tracks", fetch = FetchType.LAZY)
    Set<TrackList> trackLists = new HashSet<>();

    @ManyToMany(mappedBy = "likedTracks")
    Set<User> likes = new HashSet<>();

}
