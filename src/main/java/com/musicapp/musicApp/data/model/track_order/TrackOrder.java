package com.musicapp.musicApp.data.model.track_order;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "tracks_orders")
@Getter@Setter
public class TrackOrder {

    @EmbeddedId
    private TrackOrderId id;

    @Column(name = "order_value", nullable = false)
    private long orderValue;

    @Column(name = "list_type")
    @Enumerated(EnumType.STRING)
    private TrackListType listType;

}
