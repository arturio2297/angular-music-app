package com.musicapp.musicApp.services.genre;

import com.musicapp.musicApp.core.message.genre.GenreItem;
import com.musicapp.musicApp.data.model.EntityStatus;
import com.musicapp.musicApp.data.model.Genre;
import com.musicapp.musicApp.utils.IdUtils;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class GenreMapper {

    public GenreItem map(Genre genre) {
        final GenreItem item = new GenreItem();

        item.setId(genre.getId());
        item.setName(genre.getName());

        return item;
    }

    public List<GenreItem> map(List<Genre> genres) {
        return genres.stream().map(this::map).collect(Collectors.toList());
    }

    public Genre merge(String name) {
        final Genre genre = new Genre();

        genre.setId(IdUtils.newId());
        genre.setEntityStatus(EntityStatus.ACTIVE);
        genre.setCreatedAt(OffsetDateTime.now());
        genre.setName(name);

        return genre;
    }

}
