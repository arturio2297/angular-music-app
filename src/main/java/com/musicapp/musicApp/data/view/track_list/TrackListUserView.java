package com.musicapp.musicApp.data.view.track_list;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.time.OffsetDateTime;

@Entity
@Immutable
@Subselect(
        "SELECT _track_list.id, _track_list.name, _track_list.listening, _track_list.user_id as author_id, " +
                "_track_list.entity_status, _track_list.created_at, " +
                "_utl.user_id as user_id, _author.username as author_username, " +
                "(" +
                "SELECT COUNT(*) FROM track_list_tracks as _tlt " +
                "LEFT JOIN (" +
                "SELECT _track.id,_track.entity_status FROM tracks as _track" +
                " ) as _track ON _track.id = _tlt.track_id AND _track.entity_status = 'Active' " +
                "WHERE _tlt.track_list_id = _track_list.id " +
                ") as tracks_count " +
                "FROM track_lists as _track_list " +
                "LEFT JOIN ( " +
                "SELECT _utl.track_list_id, _utl.user_id FROM users_track_lists as _utl" +
                ") as _utl ON _utl.track_list_id = _track_list.id " +
                "LEFT JOIN (" +
                "SELECT _author.username, _author.id FROM users as _author" +
                ") as _author ON _author.id = _utl.user_id " +
                "WHERE _track_list.is_private = FALSE"
)
@Getter@Setter
public class TrackListUserView {
    @Id
    private String id;
    private String name;
    private long listening;
    private String authorId;
    private String entityStatus;
    private OffsetDateTime createdAt;
    private String userId;
    private String authorUsername;
    private int tracksCount;
}
