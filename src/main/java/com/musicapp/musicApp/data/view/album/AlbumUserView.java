package com.musicapp.musicApp.data.view.album;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.sql.Date;
import java.time.OffsetDateTime;

@Entity
@Immutable
@Subselect(
         "SELECT _album.id, _album.name, _album.listening,  _album.released_at, _album.entity_status, _album.created_at, " +
                "_group.id as group_id, _group.name as group_name," +
                "_ua.user_id as user_id, " +
                "(" +
                "SELECT COUNT(*) FROM tracks as _track " +
                "WHERE _track.album_id = _album.id AND _track.entity_status = 'Active'" +
                ") as tracks_count " +
                "FROM albums as _album " +
                "LEFT JOIN ( " +
                "SELECT _group.id, _group.name, _group.entity_status FROM groups as _group " +
                "WHERE _group.entity_status = 'Active' " +
                ") AS _group ON _album.group_id = _group.id " +
                "LEFT JOIN ( " +
                "SELECT _ua.album_id, _ua.user_id FROM users_albums as _ua" +
                ") AS _ua " +
                "ON _ua.album_id = _album.id "
)
@Getter@Setter
public class AlbumUserView {
    @Id
    private String id;
    private String name;
    private long listening;
    private Date releasedAt;
    private String entityStatus;
    private OffsetDateTime createdAt;
    private String groupId;
    private String groupName;
    private String userId;
    private int tracksCount;
}
