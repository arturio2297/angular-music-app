package com.musicapp.musicApp.data.model.track_order;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
@Getter@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class TrackOrderId implements Serializable {

    @Column(name = "track_id", nullable = false)
    private String trackId;

    @Column(name = "list_id", nullable = false)
    private String listId;

}
