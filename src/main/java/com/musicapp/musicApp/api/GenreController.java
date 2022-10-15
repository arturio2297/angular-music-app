package com.musicapp.musicApp.api;

import com.musicapp.musicApp.core.contracts.GenreService;
import com.musicapp.musicApp.core.message.genre.GenreItem;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/genres")
@RequiredArgsConstructor
public class GenreController {

    private final GenreService genreService;

    @GetMapping
    public List<GenreItem> list(@RequestParam String name) {
        return genreService.list(name);
    }

}
