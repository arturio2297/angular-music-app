package com.musicapp.musicApp.services.track_order;

import com.musicapp.musicApp.core.contracts.TrackOrderService;
import com.musicapp.musicApp.core.message.track.TrackOrderResponse;
import com.musicapp.musicApp.data.model.track_order.TrackListType;
import com.musicapp.musicApp.data.model.track_order.TrackOrder;
import com.musicapp.musicApp.data.model.track_order.TrackOrderId;
import com.musicapp.musicApp.data.repositories.TrackOrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TrackOrderServiceImpl implements TrackOrderService {

    private final TrackOrderRepository orderRepository;

    @Override
    public TrackOrderResponse get(TrackOrderId id) {
        final TrackOrder order = orderRepository.findByIdTrackIdAndIdListId(id.getTrackId(), id.getListId())
                .orElse(null);

        if (order == null) return null;

        final long count = orderRepository.countAllByIdListId(id.getListId());

        final TrackOrder next = count == 1 ? order : getNext(order);

        final TrackOrder previous = count == 1 ? order : getPrevious(order);

        final TrackOrderResponse response = new TrackOrderResponse();

        response.setCount(count);
        response.setNextId(next.getId().getTrackId());
        response.setCurrentId(id.getTrackId());
        response.setPreviousId(previous.getId().getTrackId());
        response.setFirst(order.getOrderValue() == 0);
        response.setLast(order.getOrderValue() == (count - 1));
        response.setListType(order.getListType());

        return response;
    }


    @Override
    public TrackOrderResponse first(String listId) {
        final TrackOrder order = getFirst(listId);

        if (order == null) return null;

        final long count = orderRepository.countAllByIdListId(listId);

        final TrackOrder next = count == 1 ? order : getNext(order);

        final TrackOrder previous = count == 1 ? order : getPrevious(order);

        final TrackOrderResponse response = new TrackOrderResponse();

        response.setCount(count);
        response.setNextId(next.getId().getTrackId());
        response.setCurrentId(order.getId().getTrackId());
        response.setPreviousId(previous.getId().getTrackId());
        response.setFirst(order.getOrderValue() == 0);
        response.setLast(order.getOrderValue() == (count - 1));
        response.setListType(order.getListType());

        return response;
    }

    private TrackOrder getNext(TrackOrder order) {
        final TrackOrder last = getLast(order.getId().getListId());

        if (last.getId().equals(order.getId())) {
            return getFirst(order.getId().getListId());
        }

        return orderRepository.findByOrderValueAndIdListId(order.getOrderValue() + 1, order.getId().getListId())
                .orElse(null);
    }

    private TrackOrder getPrevious(TrackOrder order) {
        final TrackOrder first = getFirst(order.getId().getListId());

        if (first.getId().equals(order.getId())) {
            return getLast(order.getId().getListId());
        }

        return orderRepository.findByOrderValueAndIdListId(order.getOrderValue() - 1, order.getId().getListId())
                .orElse(null);
    }

    @Override
    public void order(TrackOrderId id, TrackListType listType) {
        final TrackOrder first = getFirst(id.getListId());

        if (first == null) {

            final TrackOrder order = new TrackOrder();
            order.setId(id);
            order.setOrderValue(0);
            order.setListType(listType);

            orderRepository.save(order);
            return;
        }

        final TrackOrder last = getLast(id.getListId());

        if (last != null) {

            final TrackOrder order = new TrackOrder();
            order.setId(id);
            order.setOrderValue(last.getOrderValue() + 1);
            order.setListType(listType);

            orderRepository.save(order);
            return;
        }

        throw new RuntimeException();
    }

    private TrackOrder getFirst(String listId) {
        return orderRepository.findByOrderValueAndIdListId(0, listId)
                .orElse(null);
    }

    private TrackOrder getLast(String listId) {
        return orderRepository.findFirstByIdListIdOrderByOrderValueDesc(listId)
                .orElse(null);
    }

    @Override
    public void updateOrder(TrackOrderId id) {
        final TrackOrder order = orderRepository.findByIdTrackIdAndIdListId(id.getTrackId(), id.getListId())
                .orElse(null);

        if (order == null)
            throw new RuntimeException();

        final TrackOrder previous = orderRepository.findByOrderValueAndIdListId(order.getOrderValue(), id.getListId())
                .orElse(null);

        if (previous != null)
            previous.setOrderValue(order.getOrderValue());

        final List<TrackOrder> orders = orderRepository.findAllByIdListIdWhereOrderValueMoreThan(id.getListId(), order.getOrderValue());

        orders.forEach(x -> {
            x.setOrderValue(x.getOrderValue() - 1);
            orderRepository.save(x);
        });

        orderRepository.delete(order);
    }

    @Override
    public void changeOrder(String trackId1, String trackId2, String listId) {
        final TrackOrder order1 = orderRepository.findByIdTrackIdAndIdListId(trackId1, listId)
                .orElse(null);
        final TrackOrder order2= orderRepository.findByIdTrackIdAndIdListId(trackId2, listId)
                .orElse(null);

        if (order1 == null || order2 == null) throw new RuntimeException();

        final long orderValue1 = order1.getOrderValue();
        final long orderValue2 = order2.getOrderValue();

        order1.setOrderValue(orderValue2);
        order2.setOrderValue(orderValue1);

        orderRepository.save(order1);
        orderRepository.save(order2);
    }


}
