package com.musicapp.musicApp.data.repositories;

import com.musicapp.musicApp.data.model.group.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GroupRepository extends JpaRepository<Group, String> {

    Optional<Group> findByIdAndEntityStatus(String id, String entityStatus);

    Optional<Group> findByNameAndEntityStatus(String name, String entityStatus);

}
