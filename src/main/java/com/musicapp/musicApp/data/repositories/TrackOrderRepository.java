package com.musicapp.musicApp.data.repositories;

import com.musicapp.musicApp.data.model.track_order.TrackOrder;
import com.musicapp.musicApp.data.model.track_order.TrackOrderId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrackOrderRepository extends JpaRepository<TrackOrder, TrackOrderId> {

    Optional<TrackOrder> findByOrderValueAndIdListId(long value, String albumId);

    Optional<TrackOrder> findFirstByIdListIdOrderByOrderValueDesc(String albumId);

    Optional<TrackOrder> findByIdTrackIdAndIdListId(String trackId, String albumId);

    @Query(
            value = "SELECT * FROM tracks_orders as _to " +
                    "WHERE _to.list_id = ?1 AND _to.order_value > ?2 ORDER BY _to.order_value ASC",
            nativeQuery = true
    )
    List<TrackOrder> findAllByIdListIdWhereOrderValueMoreThan(String listId, long value);

    long countAllByIdListId(String listId);

}
