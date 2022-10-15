package com.musicapp.musicApp.data.view.track;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
@Immutable
@Subselect(
        "SELECT " +
                "_track.id, _track.name, _track.audio_filename, _track.entity_status, " +
                "_genre.name as genre, " +
                "_album.name as album_name, _album.id as album_id, " +
                "_group.name as group_name, _group.id as group_id, " +
                "_track_list.name as track_list_name, _track_list.id as track_list_id, " +
                "_track_order.order_value as track_order " +
                "FROM tracks as _track " +
                "LEFT JOIN ( " +
                "SELECT _album.name, _album.id, _album.group_id, _album.entity_status FROM albums as _album " +
                "WHERE _album.entity_status = 'Active' " +
                ") as _album ON _track.album_id = _album.id " +
                "LEFT JOIN ( " +
                "SELECT _group.name, _group.id, _group.entity_status FROM groups as _group " +
                "WHERE _group.entity_status = 'Active' " +
                ") as _group ON _group.id = _album.group_id " +
                "LEFT JOIN ( " +
                "SELECT _genre.name, _genre.id FROM genres as _genre " +
                ") as _genre ON _genre.id = _track.genre_id " +
                "LEFT JOIN ( " +
                "SELECT _tlt.track_id, _tlt.track_list_id FROM track_list_tracks as _tlt" +
                ") as _tlt ON _tlt.track_id = _track.id " +
                "LEFT JOIN ( " +
                "SELECT _track_list.name, _track_list.id, _track_list.entity_status FROM track_lists as _track_list " +
                "WHERE _track_list.entity_status = 'Active' " +
                ") as _track_list ON _track_list.id = _tlt.track_list_id " +
                "LEFT JOIN ( " +
                "SELECT _track_order.track_id, _track_order.list_id, _track_order.order_value FROM tracks_orders as _track_order" +
                ") as _track_order ON _track_order.track_id = _track.id AND _track_order.list_id = _track_list.id"
)
@Getter@Setter
public class TrackTrackListView {
    @Id
    private String id;
    private String name;
    private String audioFilename;
    private String entityStatus;
    private String genre;
    private String albumName;
    private String albumId;
    private String groupName;
    private String groupId;
    private String trackListName;
    private String trackListId;
    @Column(name = "track_order")
    private long order;
}
