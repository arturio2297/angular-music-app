package com.musicapp.musicApp.core.contracts;

import com.musicapp.musicApp.core.message.genre.GenreItem;
import com.musicapp.musicApp.data.model.Genre;

import java.util.List;

public interface GenreService {
    List<GenreItem> list(String name);
    Genre getOrCreate(String name);
}
