package com.musicapp.musicApp.services.player;

import com.musicapp.musicApp.core.ApplicationException;
import com.musicapp.musicApp.core.contracts.PlayerService;
import com.musicapp.musicApp.core.contracts.TrackOrderService;
import com.musicapp.musicApp.core.contracts.TrackService;
import com.musicapp.musicApp.core.message.error.ErrorCode;
import com.musicapp.musicApp.core.message.player.PlayerResponse;
import com.musicapp.musicApp.core.message.track.TrackOrderResponse;
import com.musicapp.musicApp.data.model.EntityStatus;
import com.musicapp.musicApp.data.model.album.Album;
import com.musicapp.musicApp.data.model.track_list.TrackList;
import com.musicapp.musicApp.data.model.track_order.TrackListType;
import com.musicapp.musicApp.data.model.track_order.TrackOrderId;
import com.musicapp.musicApp.data.repositories.AlbumRepository;
import com.musicapp.musicApp.data.repositories.TrackListRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlayerServiceImpl implements PlayerService {

    private final TrackListRepository trackListRepository;
    private final AlbumRepository albumRepository;
    private final TrackOrderService orderService;
    private final TrackService trackService;

    @Override
    public PlayerResponse get(String trackId, String listId) throws ApplicationException {
        final TrackOrderResponse order = orderService.get(new TrackOrderId(trackId, listId));

        if (order == null)
            throw new ApplicationException(ErrorCode.NOT_FOUND);

        final PlayerResponse response = new PlayerResponse();

        response.setCount(order.getCount());
        response.setNext(trackService.get(order.getNextId()));
        response.setCurrent(trackService.get(order.getCurrentId()));
        response.setPrevious(trackService.get(order.getPreviousId()));
        response.setFirst(order.isFirst());
        response.setLast(order.isLast());
        response.setListType(order.getListType());

        incrementListening(listId, order.getListType());

        return response;
    }

    @Override
    public PlayerResponse first(String listId) throws ApplicationException {
        final TrackOrderResponse order = orderService.first(listId);

        if (order == null)
            throw new ApplicationException(ErrorCode.NOT_FOUND);

        final PlayerResponse response = new PlayerResponse();

        response.setCount(order.getCount());
        response.setNext(trackService.get(order.getNextId()));
        response.setCurrent(trackService.get(order.getCurrentId()));
        response.setPrevious(trackService.get(order.getPreviousId()));
        response.setFirst(order.isFirst());
        response.setLast(order.isLast());
        response.setListType(order.getListType());

        incrementListening(listId, order.getListType());

        return response;
    }

    private void incrementListening(String listId, TrackListType listType) {
        switch (listType) {
            case TrackList:
                final TrackList trackList = trackListRepository.findByIdAndEntityStatus(listId, EntityStatus.ACTIVE)
                        .orElse(null);
                if (trackList == null) return;
                trackList.setListening(trackList.getListening() + 1);
                trackListRepository.save(trackList);
                break;
            case Album:
                final Album  album = albumRepository.findByIdAndEntityStatus(listId, EntityStatus.ACTIVE)
                        .orElse(null);
                if (album == null) return;
                album.setListening(album.getListening() + 1);
                albumRepository.save(album);
                break;
        }
    }

}
