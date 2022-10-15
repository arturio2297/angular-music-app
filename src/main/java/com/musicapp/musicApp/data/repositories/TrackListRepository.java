package com.musicapp.musicApp.data.repositories;

import com.musicapp.musicApp.data.model.track_list.TrackList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrackListRepository extends JpaRepository<TrackList, String> {

    @Query("SELECT _tl FROM TrackList _tl WHERE _tl.createdBy.id = ?1 AND _tl.isPrivate = TRUE")
    TrackList findPrivate(String userId);

    Optional<TrackList> findByIdAndEntityStatus(String id, String entityStatus);

    @Query("SELECT _tl FROM TrackList _tl WHERE _tl.name = ?1 AND _tl.entityStatus = ?2 AND _tl.isPrivate = FALSE")
    Optional<TrackList> findByNameAndEntityStatus(String name, String entityStatus);

}
