package com.musicapp.musicApp.data.repositories;

import com.musicapp.musicApp.data.model.album.Album;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlbumRepository extends JpaRepository<Album, String> {

    Optional<Album> findByIdAndEntityStatus(String id, String entityStatus);

    @Query("SELECT a FROM Album a WHERE a.name = ?1 AND a.entityStatus = ?2 AND a.group.id = ?3")
    Optional<Album> findByNameAndEntityStatusAndGroupId(String name, String entityStatus, String groupId);

}
