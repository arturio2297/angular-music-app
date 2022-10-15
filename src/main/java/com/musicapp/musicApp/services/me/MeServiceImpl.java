package com.musicapp.musicApp.services.me;

import com.musicapp.musicApp.core.contracts.AccountService;
import com.musicapp.musicApp.core.contracts.MeService;
import com.musicapp.musicApp.core.contracts.TrackListService;
import com.musicapp.musicApp.core.message.album.AlbumItem;
import com.musicapp.musicApp.core.message.album.UserAlbumFilterParameters;
import com.musicapp.musicApp.core.message.common.PageResponse;
import com.musicapp.musicApp.core.message.track.TrackItem;
import com.musicapp.musicApp.core.message.track.TrackTrackListFilterParameters;
import com.musicapp.musicApp.core.message.track.UserTrackFilterParameters;
import com.musicapp.musicApp.core.message.track_list.TrackListItem;
import com.musicapp.musicApp.core.message.track_list.UserTrackListFilterParameters;
import com.musicapp.musicApp.data.model.EntityStatus;
import com.musicapp.musicApp.data.model.user.User;
import com.musicapp.musicApp.data.view.album.AlbumUserView;
import com.musicapp.musicApp.data.view.track_list.TrackListUserView;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.query.criteria.internal.OrderImpl;
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
public class MeServiceImpl implements MeService {

    private final AccountService accountService;
    private final TrackListService trackListService;
    private final MeMapper meMapper;
    private final EntityManager entityManager;

    @Override
    public PageResponse<AlbumItem> albums(UserAlbumFilterParameters parameters) {
        final int page = Math.max(parameters.getPage(), 0);
        final int size = Math.max(parameters.getSize(), 1);

        final CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        final CriteriaQuery<AlbumUserView> criteriaQuery = builder.createQuery(AlbumUserView.class);
        final Root<AlbumUserView> root = criteriaQuery.from(AlbumUserView.class);

        Predicate whereClause = builder.equal(root.get("entityStatus"), EntityStatus.ACTIVE);

        final User user = accountService.authorization();

        whereClause = builder.and(
                whereClause,
                builder.equal(root.get("userId"), user.getId())
        );

        if (parameters.getSearch() != null && !StringUtils.isBlank(parameters.getSearch())) {
            final String like = "%" + parameters.getSearch().toLowerCase() + "%";
            whereClause = builder.and(
                    whereClause,
                    builder.like(
                            builder.concat(
                                    builder.lower(root.get("name")),
                                    builder.lower(root.get("groupName"))
                            ), like)
            );
        }

        if (parameters.getGroupId() != null && !StringUtils.isBlank(parameters.getGroupId())) {
            whereClause = builder.and(
                    whereClause,
                    builder.equal(root.get("groupId"), parameters.getGroupId())
            );
        }

        criteriaQuery.where(whereClause);

        criteriaQuery.orderBy(
                new OrderImpl(root.get("createdAt"), true)
        );

        final TypedQuery<AlbumUserView> typedQuery = entityManager.createQuery(criteriaQuery);
        typedQuery.setMaxResults(size);
        typedQuery.setFirstResult(page * size);

        final List<AlbumUserView> items = typedQuery.getResultList();

        final CriteriaQuery<Long> countQuery = builder.createQuery(Long.class);
        countQuery.select(builder.count(countQuery.from(AlbumUserView.class)));

        countQuery.where(whereClause);

        final long totalElements = entityManager.createQuery(countQuery).getSingleResult();
        final long totalPages = (long) Math.ceil(1.0 * totalElements / size);

        final PageResponse<AlbumItem> response = new PageResponse<>();
        response.setPage(page);
        response.setSize(size);
        response.setTotalPages(totalPages);
        response.setTotalElements(totalElements);
        response.setItems(meMapper.mapAlbum(items));

        return response;
    }

    @Override
    public PageResponse<TrackListItem> trackLists(UserTrackListFilterParameters parameters) {
        final int page = Math.max(parameters.getPage(), 0);
        final int size = Math.max(parameters.getSize(), 1);

        final CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        final CriteriaQuery<TrackListUserView> criteriaQuery = builder.createQuery(TrackListUserView.class);
        final Root<TrackListUserView> root = criteriaQuery.from(TrackListUserView.class);

        Predicate whereClause = builder.equal(root.get("entityStatus"), EntityStatus.ACTIVE);

        final User user = accountService.authorization();

        whereClause = builder.and(
                whereClause,
                builder.equal(root.get("userId"), user.getId())
        );

        if (parameters.getSearch() != null && !StringUtils.isBlank(parameters.getSearch())) {
            final String like = "%" + parameters.getSearch().toLowerCase() + "%";
            whereClause = builder.and(
                    whereClause,
                    builder.like(builder.lower(root.get("name")), like)
            );
        }

        if (parameters.getAuthorId() != null && !StringUtils.isBlank(parameters.getAuthorId())) {
            whereClause = builder.and(
                    whereClause,
                    builder.equal(root.get("createdBy").get("id"), parameters.getAuthorId())
            );
        }

        criteriaQuery.where(whereClause);

        criteriaQuery.orderBy(
                new OrderImpl(root.get("createdAt"), true)
        );

        final TypedQuery<TrackListUserView> typedQuery = entityManager.createQuery(criteriaQuery);
        typedQuery.setMaxResults(size);
        typedQuery.setFirstResult(page * size);

        final List<TrackListUserView> items = typedQuery.getResultList();

        final CriteriaQuery<Long> countQuery = builder.createQuery(Long.class);
        countQuery.select(builder.count(countQuery.from(TrackListUserView.class)));

        countQuery.where(whereClause);

        final long totalElements = entityManager.createQuery(countQuery).getSingleResult();
        final long totalPages = (long) Math.ceil(1.0 * totalElements / size);

        final PageResponse<TrackListItem> response = new PageResponse<>();
        response.setPage(page);
        response.setSize(size);
        response.setTotalPages(totalPages);
        response.setTotalElements(totalElements);
        response.setItems(meMapper.mapTrackList(items));

        return response;
    }

    @Override
    public PageResponse<TrackItem> tracks(UserTrackFilterParameters parameters) {
        final User user = accountService.authorization();
        final TrackTrackListFilterParameters filterParameters = new TrackTrackListFilterParameters();
        filterParameters.setTrackListId(user.getPrivateTrackList().getId());
        filterParameters.setSearch(parameters.getSearch());
        filterParameters.setPage(parameters.getPage());
        filterParameters.setSize(parameters.getSize());
        return trackListService.tracks(filterParameters);
    }

}
