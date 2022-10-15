package com.musicapp.musicApp.core.contracts;

import com.musicapp.musicApp.core.ApplicationException;
import com.musicapp.musicApp.core.message.player.PlayerResponse;

public interface PlayerService {
    PlayerResponse get(String trackId, String listId) throws ApplicationException;
    PlayerResponse first(String listId) throws ApplicationException;
}
