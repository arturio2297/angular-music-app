package com.musicapp.musicApp.services.genre;

import com.musicapp.musicApp.core.contracts.GenreService;
import com.musicapp.musicApp.core.message.genre.GenreItem;
import com.musicapp.musicApp.data.model.EntityStatus;
import com.musicapp.musicApp.data.model.Genre;
import com.musicapp.musicApp.data.repositories.GenreRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class GenreServiceImpl implements GenreService {

    private final GenreRepository genreRepository;
    private final GenreMapper genreMapper;
    private final EntityManager entityManager;

    @Override
    public List<GenreItem> list(String name) {
        final CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        final CriteriaQuery<Genre> criteriaQuery = builder.createQuery(Genre.class);
        final Root<Genre> root = criteriaQuery.from(Genre.class);

        final String like = "%" + name.toLowerCase() + "%";
        Predicate whereClause = builder.and(builder.like(builder.lower(root.get("name")), like));

        criteriaQuery.where(whereClause);

        final TypedQuery<Genre> typedQuery = entityManager.createQuery(criteriaQuery);

        return genreMapper.map(typedQuery.getResultList());
    }

    @Override
    public Genre getOrCreate(String name) {
        final Genre existed = genreRepository.findByNameAndEntityStatus(name, EntityStatus.ACTIVE)
                .orElse(null);

        if (existed != null)
            return existed;

        final Genre genre = genreMapper.merge(name);
        return genreRepository.save(genre);
    }

}
