package com.musicapp.musicApp.api;

import com.musicapp.musicApp.core.ApplicationException;
import com.musicapp.musicApp.core.contracts.PlayerService;
import com.musicapp.musicApp.core.message.player.PlayerResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/player")
@RequiredArgsConstructor
public class PlayerController {

    private final PlayerService playerService;

    @GetMapping("/{listId}")
    public PlayerResponse next(@PathVariable String listId, @RequestParam String trackId) throws ApplicationException {
        return playerService.get(trackId, listId);
    }

    @GetMapping("/{listId}/first")
    public PlayerResponse first(@PathVariable String listId) throws ApplicationException {
        return playerService.first(listId);
    }

}
