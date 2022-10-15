package com.musicapp.musicApp.data.model.group;

import com.musicapp.musicApp.data.model.EntityBase;
import com.musicapp.musicApp.data.model.Genre;
import com.musicapp.musicApp.data.model.album.Album;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(name = "groups")
@Getter@Setter
public class Group extends EntityBase {

    @Column(name = "additional_info", length = 1000)
    private String additionalInfo;

    @Column(name = "image_filename")
    private String imageFilename;

    @OneToMany(mappedBy = "group", fetch = FetchType.LAZY)
    private Set<Album> albums;

    public List<Genre> getGenres() {
        final List<Genre> genres = new ArrayList<>();
        for (Album album : albums) {
            genres.addAll(album.getGenres());
        }
        return genres.stream()
                .distinct()
                .collect(Collectors.toList());
    }

    public int getAlbumsCount() {
        return (int) albums.stream()
                .filter(EntityBase::isActive)
                .count();
    }

}
