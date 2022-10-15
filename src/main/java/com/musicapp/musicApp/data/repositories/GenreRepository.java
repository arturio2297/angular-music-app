package com.musicapp.musicApp.data.repositories;

import com.musicapp.musicApp.data.model.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GenreRepository extends JpaRepository<Genre, String> {

    List<Genre> findAllByEntityStatus(String entityStatus);

    Optional<Genre> findByIdAndEntityStatus(String id, String entityStatus);

    Optional<Genre> findByNameAndEntityStatus(String name, String entityStatus);

}
