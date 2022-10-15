package com.musicapp.musicApp.data.repositories;

import com.musicapp.musicApp.data.model.track.Track;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrackRepository extends JpaRepository<Track, String> {

    Optional<Track> findByIdAndEntityStatus(String id, String entityStatus);

    @Query("SELECT t from Track t WHERE t.name = ?1 AND t.entityStatus = ?2 AND t.album.id = ?3")
    Optional<Track> findByNameAndEntityStatusAndAlbumId(String name, String entityStatus, String albumId);

}
