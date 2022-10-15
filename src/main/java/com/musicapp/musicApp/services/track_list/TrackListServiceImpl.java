package com.musicapp.musicApp.services.track_list;

import com.musicapp.musicApp.configuration.application.ApplicationConfiguration;
import com.musicapp.musicApp.core.ApplicationException;
import com.musicapp.musicApp.core.contracts.*;
import com.musicapp.musicApp.core.message.common.FileRequest;
import com.musicapp.musicApp.core.message.common.FileResponse;
import com.musicapp.musicApp.core.message.common.LikeResponse;
import com.musicapp.musicApp.core.message.common.PageResponse;
import com.musicapp.musicApp.core.message.error.ErrorCode;
import com.musicapp.musicApp.core.message.track.TrackFilterParameters;
import com.musicapp.musicApp.core.message.track.TrackItem;
import com.musicapp.musicApp.core.message.track.TrackTrackListFilterParameters;
import com.musicapp.musicApp.core.message.track_list.*;
import com.musicapp.musicApp.data.model.EntityStatus;
import com.musicapp.musicApp.data.model.track.Track;
import com.musicapp.musicApp.data.model.track_list.TrackList;
import com.musicapp.musicApp.data.model.track_order.TrackListType;
import com.musicapp.musicApp.data.model.track_order.TrackOrderId;
import com.musicapp.musicApp.data.model.user.User;
import com.musicapp.musicApp.data.repositories.TrackListRepository;
import com.musicapp.musicApp.data.repositories.TrackRepository;
import com.musicapp.musicApp.data.view.track.TrackTrackListView;
import com.musicapp.musicApp.utils.Base64Utils;
import com.musicapp.musicApp.utils.IdUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.query.criteria.internal.OrderImpl;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TrackListServiceImpl implements TrackListService {

    private final ApplicationConfiguration applicationConfiguration;
    private final TrackListRepository trackListRepository;
    private final TrackRepository trackRepository;
    private final AccountService accountService;
    private final TrackOrderService orderService;
    private final LikeService likeService;
    private final SaveService saveService;
    private final TrackService trackService;
    private final TrackListMapper trackListMapper;
    private final EntityManager entityManager;

    @Override
    public PageResponse<TrackListItem> list(TrackListFilterParameters parameters) {
        final int page = Math.max(parameters.getPage(), 0);
        final int size = Math.max(parameters.getSize(), 1);

        final CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        final CriteriaQuery<TrackList> criteriaQuery = builder.createQuery(TrackList.class);
        final Root<TrackList> root = criteriaQuery.from(TrackList.class);

        Predicate whereClause = builder.equal(root.get("entityStatus"), EntityStatus.ACTIVE);

        whereClause = builder.and(
                whereClause,
                builder.equal(root.get("isPrivate"), false)
        );

        if (parameters.getSearch() != null && !StringUtils.isBlank(parameters.getSearch())) {
            final String like = "%" + parameters.getSearch().toLowerCase() + "%";
            whereClause = builder.and(
                    whereClause,
                    builder.like(builder.lower(root.get("name")), like)
            );
        }

        if (parameters.getAuthor() != null && !StringUtils.isBlank(parameters.getAuthor())) {
            whereClause = builder.and(
                    whereClause,
                    builder.equal(root.get("createdBy").get("username"), parameters.getAuthor())
            );
        }

        if (parameters.getAuthorId() != null && !StringUtils.isBlank(parameters.getAuthorId())) {
            whereClause = builder.and(
                    whereClause,
                    builder.equal(root.get("createdBy").get("id"), parameters.getAuthorId())
            );
        }

        criteriaQuery.where(whereClause);

        final String sort = (parameters.getSort() != null && !StringUtils.isBlank(parameters.getSort())) ?
                parameters.getSort() : "createdAt";
        final boolean isAscending = StringUtils.equalsIgnoreCase(parameters.getOrder(), "asc");
        criteriaQuery.orderBy(
                new OrderImpl(root.get(sort), isAscending)
        );

        final TypedQuery<TrackList> typedQuery = entityManager.createQuery(criteriaQuery);
        typedQuery.setMaxResults(size);
        typedQuery.setFirstResult(page * size);

        final List<TrackList> items = typedQuery.getResultList();

        final CriteriaQuery<Long> countQuery = builder.createQuery(Long.class);
        countQuery.select(builder.count(countQuery.from(TrackList.class)));

        countQuery.where(whereClause);

        final long totalElements = entityManager.createQuery(countQuery).getSingleResult();
        final long totalPages = (long) Math.ceil(1.0 * totalElements / size);

        final PageResponse<TrackListItem> response = new PageResponse<>();
        response.setPage(page);
        response.setSize(size);
        response.setTotalPages(totalPages);
        response.setTotalElements(totalElements);
        response.setItems(
                trackListMapper.map(items).stream().map(x -> {
                    if (parameters.getTracksCount() <= 0) {
                        x.setTracks(new ArrayList<>());
                        return x;
                    }

                    final TrackFilterParameters trackParameters = new TrackFilterParameters();
                    trackParameters.setSize(parameters.getTracksCount());
                    trackParameters.setTrackListId(x.getId());
                    x.setTracks(trackService.list(trackParameters).getItems());

                    return x;
                }).collect(Collectors.toList())
        );

        return response;
    }

    @Override
    public PageResponse<TrackItem> tracks(TrackTrackListFilterParameters parameters) {
        final int page = Math.max(parameters.getPage(), 0);
        final int size = Math.max(parameters.getSize(), 1);

        final CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        final CriteriaQuery<TrackTrackListView> criteriaQuery = builder.createQuery(TrackTrackListView.class);
        final Root<TrackTrackListView> root = criteriaQuery.from(TrackTrackListView.class);

        Predicate whereClause = builder.equal(root.get("entityStatus"), EntityStatus.ACTIVE);

        if (parameters.getSearch() != null && !StringUtils.isBlank(parameters.getSearch())) {
            final String like = "%" + parameters.getSearch().toLowerCase() + "%";

            Expression<String> searchExp = builder.concat(
                    builder.lower(root.get("name")),
                    builder.lower(root.get("albumName"))
            );
            searchExp = builder.concat(
                    searchExp,
                    builder.lower(root.get("groupName"))
            );
            searchExp = builder.concat(
                    searchExp,
                    builder.lower(root.get("trackListName"))
            );
            whereClause = builder.and(
                    whereClause,
                    builder.like(searchExp, like)
            );
        }

        whereClause = builder.and(
                whereClause,
                builder.equal(root.get("trackListId"), parameters.getTrackListId())
        );

        criteriaQuery.where(whereClause);

        criteriaQuery.orderBy(
                new OrderImpl(root.get("order"), true)
        );

        final TypedQuery<TrackTrackListView> typedQuery = entityManager.createQuery(criteriaQuery);
        typedQuery.setMaxResults(size);
        typedQuery.setFirstResult(page * size);

        final List<TrackTrackListView> items = typedQuery.getResultList();

        final CriteriaQuery<Long> countQuery = builder.createQuery(Long.class);
        countQuery.select(builder.count(countQuery.from(TrackTrackListView.class)));

        countQuery.where(whereClause);

        final long totalElements = entityManager.createQuery(countQuery).getSingleResult();
        final long totalPages = (long) Math.ceil(1.0 * totalElements / size);

        final PageResponse<TrackItem> response = new PageResponse<>();
        response.setPage(page);
        response.setSize(size);
        response.setTotalPages(totalPages);
        response.setTotalElements(totalElements);
        response.setItems(trackListMapper.mapTrack(items));

        return response;
    }

    @Override
    public TrackListResponse get(String id) throws ApplicationException {
        final TrackList trackList = trackListRepository.findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
                .orElseThrow(() -> new ApplicationException(ErrorCode.NOT_FOUND));

        final TrackListResponse response = new TrackListResponse();
        trackListMapper.merge(trackList, response);
        return response;
    }

    @Override
    public FileResponse getImage(String id) throws ApplicationException, IOException {
        final TrackList trackList = trackListRepository.findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
                .orElseThrow(() -> new ApplicationException(ErrorCode.NOT_FOUND));

        if (trackList.getImageFilename() == null)
            throw new ApplicationException(ErrorCode.NOT_FOUND);

        final Path path = Paths.get(applicationConfiguration.getImagesPath()).resolve(trackList.getImageFilename());
        final FileResponse response = new FileResponse();

        response.setResource(new UrlResource(path.toUri().toURL()));
        response.setContentType(Files.probeContentType(path));

        return response;
    }

    @Override
    public TrackListResponse add(AddTrackListRequest request, MultipartFile image) throws ApplicationException, IOException {
        final TrackList existed = trackListRepository.findByNameAndEntityStatus(request.getName(), EntityStatus.ACTIVE)
                .orElse(null);

        if (existed != null)
            throw new ApplicationException(ErrorCode.UNKNOWN);

        final TrackList trackList = new TrackList();

        trackList.setId(IdUtils.newId());
        trackList.setEntityStatus(EntityStatus.ACTIVE);
        trackList.setCreatedAt(OffsetDateTime.now());

        final Set<Track> tracks = trackList.getTracks();

        for (String trackId : request.getAddedTracksIds()) {
            final Track track = trackRepository.findByIdAndEntityStatus(trackId, EntityStatus.ACTIVE)
                    .orElse(null);

            if (track == null) {
                log.error("Can`t add track to track list cause track with id: \"{}\", not found", trackId);
                continue;
            }

            tracks.add(track);
            orderService.order(new TrackOrderId(
                    trackId,
                    trackList.getId()
            ), TrackListType.TrackList);
        }

        trackListMapper.merge(trackList, request);
        setImage(trackList, request.getImage(), image);
        trackList.setCreatedBy(accountService.authorization());

        trackListRepository.save(trackList);

        final TrackListResponse response = new TrackListResponse();
        trackListMapper.merge(trackList, response);

        return response;
    }

    @Override
    public TrackListResponse update(String id, UpdateTrackListRequest request, MultipartFile image) throws ApplicationException, IOException {
        final TrackList trackList = trackListRepository.findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
                .orElseThrow(() -> new ApplicationException(ErrorCode.NOT_FOUND));

        final TrackList existed = trackListRepository.findByNameAndEntityStatus(request.getName(), EntityStatus.ACTIVE)
                .orElse(null);

        if (existed != null && !StringUtils.equals(trackList.getId(), existed.getId()))
            throw new ApplicationException(ErrorCode.UNKNOWN);

        trackList.setLastUpdatedAt(OffsetDateTime.now());

        final Set<Track> tracks = trackList.getTracks();

        for (String trackId : request.getAddedTracksIds()) {
            final Track track = trackRepository.findByIdAndEntityStatus(trackId, EntityStatus.ACTIVE)
                    .orElse(null);

            if (track == null) {
                log.error("Can`t add track to track list cause track with id: \"{}\" not found", trackId);
                continue;
            }

            if (tracks.contains(track)) {
                log.error("Can`t add track cause track list already contains track with id: \"{}\"", track.getId());
                continue;
            }

            tracks.add(track);
            orderService.order(new TrackOrderId(
                    trackId,
                    trackList.getId()
            ), TrackListType.TrackList);
        }

        for (String trackId : request.getDeletedTracksIds()) {
            final Track track = trackRepository.findByIdAndEntityStatus(trackId, EntityStatus.ACTIVE)
                    .orElse(null);

            if (track == null) {
                log.error("Can`t delete track from track list cause track with id: \"{}\" not found", trackId);
                continue;
            }

            if (!tracks.contains(track)) {
                log.error("Can`t delete track cause track width id: \"{}\" not in track list", trackId);
                continue;
            }

            tracks.remove(track);
            orderService.updateOrder(new TrackOrderId(
                    trackId,
                    trackList.getId()
            ));
        }

        trackListMapper.merge(trackList, request);
        setImage(trackList, request.getImage(), image);

        trackListRepository.save(trackList);

        final TrackListResponse response = new TrackListResponse();
        trackListMapper.merge(trackList, response);

        return response;
    }

    private void setImage(TrackList trackList, FileRequest request, MultipartFile image) throws IOException {
        if (request == null && image == null) return;

        final String filename = image != null ? image.getOriginalFilename() : request.getFilename();
        final byte[] content = image != null ? image.getBytes() : Base64Utils.encode(request.getBase64());

        final String imageFilename = IdUtils.newId() + "-" + filename;
        trackList.setImageFilename(imageFilename);
        final Path path = Paths.get(applicationConfiguration.getImagesPath()).resolve(imageFilename);
        Files.write(path, content);
    }

    @Override
    public TrackList createPrivate(User user) throws ApplicationException {
        final TrackList existed = trackListRepository.findPrivate(user.getId());

        if (existed != null)
            throw new ApplicationException(ErrorCode.UNKNOWN);

        final TrackList trackList = new TrackList();

        trackList.setId(IdUtils.newId());
        trackList.setEntityStatus(EntityStatus.ACTIVE);
        trackList.setCreatedAt(OffsetDateTime.now());

        trackList.setCreatedBy(user);
        trackList.setName(user.getUsername());
        trackList.setPrivate(true);

        return trackList;
    }

    @Override
    public boolean checkExistsByName(String name, String trackListId) {
        final TrackList existed = trackListRepository.findByNameAndEntityStatus(name, EntityStatus.ACTIVE)
                .orElse(null);
        if (existed == null) return false;
        if (trackListId == null || StringUtils.isBlank(trackListId)) return true;
        return !StringUtils.equals(existed.getId(), trackListId);
    }

    @Override
    public LikeResponse like(String id) throws ApplicationException {
        final TrackList trackList = trackListRepository.findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
                .orElseThrow(() -> new ApplicationException(ErrorCode.NOT_FOUND));

        return likeService.like(trackList);
    }

    @Override
    public boolean save(String id) throws ApplicationException {
        final TrackList trackList = trackListRepository.findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
                .orElseThrow(() -> new ApplicationException(ErrorCode.NOT_FOUND));

        return saveService.save(trackList);
    }

    @Override
    public void delete(String id) throws ApplicationException {
        final TrackList trackList = trackListRepository.findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
                .orElseThrow(() -> new ApplicationException(ErrorCode.NOT_FOUND));

        if (trackList.isPrivate())
            throw new ApplicationException(ErrorCode.FORBIDDEN);

        final User account = accountService.authorization();

        if (account.isUser() && !StringUtils.equals(trackList.getCreatedBy().getId(), account.getId()))
            throw new ApplicationException(ErrorCode.FORBIDDEN);

        trackList.setEntityStatus(EntityStatus.DELETED);

        trackListRepository.save(trackList);
    }
}
