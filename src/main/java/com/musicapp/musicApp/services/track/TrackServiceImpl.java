package com.musicapp.musicApp.services.track;

import com.musicapp.musicApp.configuration.application.ApplicationConfiguration;
import com.musicapp.musicApp.core.ApplicationException;
import com.musicapp.musicApp.core.contracts.*;
import com.musicapp.musicApp.core.message.common.FileResponse;
import com.musicapp.musicApp.core.message.common.LikeResponse;
import com.musicapp.musicApp.core.message.common.PageResponse;
import com.musicapp.musicApp.core.message.error.ErrorCode;
import com.musicapp.musicApp.core.message.track.*;
import com.musicapp.musicApp.data.model.EntityStatus;
import com.musicapp.musicApp.data.model.Genre;
import com.musicapp.musicApp.data.model.album.Album;
import com.musicapp.musicApp.data.model.track.Track;
import com.musicapp.musicApp.data.model.track_list.TrackList;
import com.musicapp.musicApp.data.model.track_order.TrackListType;
import com.musicapp.musicApp.data.model.track_order.TrackOrderId;
import com.musicapp.musicApp.data.repositories.AlbumRepository;
import com.musicapp.musicApp.data.repositories.TrackListRepository;
import com.musicapp.musicApp.data.repositories.TrackRepository;
import com.musicapp.musicApp.utils.FileUtils;
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
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class TrackServiceImpl implements TrackService {

    private final ApplicationConfiguration applicationConfiguration;
    private final TrackRepository trackRepository;
    private final AlbumRepository albumRepository;
    private final TrackListRepository trackListRepository;
    private final GenreService genreService;
    private final LikeService likeService;
    private final SaveService saveService;
    private final TrackOrderService orderService;
    private final TrackMapper trackMapper;
    private final EntityManager entityManager;

    @Override
    public PageResponse<TrackItem> list(TrackFilterParameters parameters) {
        final int page = Math.max(parameters.getPage(), 0);
        final int size = Math.max(parameters.getSize(), 1);

        final CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        final CriteriaQuery<Track> criteriaQuery = builder.createQuery(Track.class);
        final Root<Track> root = criteriaQuery.from(Track.class);

        Predicate whereClause = builder.equal(root.get("entityStatus"), EntityStatus.ACTIVE);

        if (parameters.getSearch() != null && !StringUtils.isBlank(parameters.getSearch())) {
            final String like = "%" + parameters.getSearch().toLowerCase() + "%";

            Expression<String> searchExp = builder.concat(
                    builder.lower(root.get("name")),
                    builder.lower(root.get("album").get("name"))
            );
            searchExp = builder.concat(
                    searchExp,
                    builder.lower(root.get("album").get("group").get("name"))
            );
            whereClause = builder.and(
                    whereClause,
                    builder.like(searchExp, like)
            );
        }

        if (parameters.getGroupId() != null && !StringUtils.isBlank(parameters.getGroupId())) {
            whereClause = builder.and(
                    whereClause,
                    builder.equal(root.get("album").get("group").get("id"), parameters.getGroupId())
            );
        }

        if (parameters.getAlbumId() != null && !StringUtils.isBlank(parameters.getAlbumId())) {
            whereClause = builder.and(
                    whereClause,
                    builder.equal(root.get("album").get("id"), parameters.getAlbumId())
            );
        }

        if (parameters.getTrackListId() != null && !StringUtils.isBlank(parameters.getTrackListId())) {
            final TrackList trackList = trackListRepository.findByIdAndEntityStatus(
                    parameters.getTrackListId(),
                    EntityStatus.ACTIVE
            ).orElse(null);

            if (trackList != null) {
                whereClause = builder.and(
                        whereClause,
                        root.get("id").in(trackList.getTracksIds())
                );
            }
        }

        if (parameters.getNotInGroup() != null && !StringUtils.isBlank(parameters.getNotInGroup())) {
            whereClause = builder.and(
                    whereClause,
                    builder.not(builder.equal(root.get("album").get("group").get("id"), parameters.getNotInAlbum()))
            );
        }

        if (parameters.getNotInAlbum() != null && !StringUtils.isBlank(parameters.getNotInAlbum())) {
            whereClause = builder.and(
                    whereClause,
                    builder.not(builder.equal(root.get("album").get("id"), parameters.getNotInAlbum()))
            );
        }

        if (parameters.getNotInTrackList() != null && !StringUtils.isBlank(parameters.getNotInTrackList())) {
            final TrackList trackList = trackListRepository.findByIdAndEntityStatus(
                    parameters.getNotInTrackList(),
                            EntityStatus.ACTIVE
                    )
                    .orElse(null);

            if (trackList != null) {
                whereClause = builder.and(
                        whereClause,
                        builder.not(root.get("id").in(trackList.getTracksIds()))
                );
            }
        }

        criteriaQuery.where(whereClause);

        criteriaQuery.orderBy(
                new OrderImpl(root.get("createdAt"), true)
        );

        final TypedQuery<Track> typedQuery = entityManager.createQuery(criteriaQuery);
        typedQuery.setMaxResults(size);
        typedQuery.setFirstResult(page * size);

        final List<Track> items = typedQuery.getResultList();

        final CriteriaQuery<Long> countQuery = builder.createQuery(Long.class);
        countQuery.select(builder.count(countQuery.from(Track.class)));

        countQuery.where(whereClause);

        final long totalElements = entityManager.createQuery(countQuery).getSingleResult();
        final long totalPages = (long) Math.ceil(1.0 * totalElements / size);

        final PageResponse<TrackItem> response = new PageResponse<>();
        response.setPage(page);
        response.setSize(size);
        response.setTotalPages(totalPages);
        response.setTotalElements(totalElements);
        response.setItems(trackMapper.map(items));

        return response;
    }

    @Override
    public TrackItem get(String id) throws ApplicationException {
        final Track track = trackRepository.findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
                .orElseThrow(() -> new ApplicationException(ErrorCode.NOT_FOUND));

        return trackMapper.map(track);
    }

    @Override
    public FileResponse getAudio(String id) throws IOException, ApplicationException {
        final Track track = trackRepository.findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
                .orElseThrow(() -> new ApplicationException(ErrorCode.NOT_FOUND));

        final Path path = Paths.get(applicationConfiguration.getAudioPath()).resolve(track.getAudioFilename());
        final FileResponse response = new FileResponse();

        response.setResource(new UrlResource(path.toUri().toURL()));
        response.setContentType(Files.probeContentType(path));

        return response;
    }

    @Override
    public TrackItem add(
            AddTrackRequest request,
            MultipartFile audio
    ) throws ApplicationException, IOException {
        final Track existed = trackRepository.findByNameAndEntityStatusAndAlbumId(
                request.getName(), EntityStatus.ACTIVE, request.getAlbumId()
        ).orElse(null);

        if (existed != null)
            throw new ApplicationException(ErrorCode.TRACK_ALREADY_EXISTS);

        final Track track = new Track();

        track.setId(IdUtils.newId());
        track.setEntityStatus(EntityStatus.ACTIVE);
        track.setCreatedAt(OffsetDateTime.now());
        track.setAlbum(getAlbum(request.getAlbumId()));
        track.setGenre(getGenre(request.getGenre()));
        trackMapper.merge(track, request);

        setAudio(track, audio);

        trackRepository.save(track);

        orderService.order(new TrackOrderId(
                track.getId(),
                track.getAlbum().getId()
        ), TrackListType.Album);
        orderService.order(new TrackOrderId(
                track.getId(),
                track.getAlbum().getGroup().getId()
        ), TrackListType.Group);

        return trackMapper.map(track);
    }

    @Override
    public TrackItem update(
            String id,
            UpdateTrackRequest request,
            MultipartFile audio
    ) throws ApplicationException, IOException {
        final Track existed = trackRepository.findByNameAndEntityStatusAndAlbumId(
                request.getName(), EntityStatus.ACTIVE, request.getAlbumId()
        ).orElse(null);

        final Track track = trackRepository.findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
                .orElseThrow(() -> new ApplicationException(ErrorCode.NOT_FOUND));

        if (existed != null && !StringUtils.equals(existed.getId(), id))
            throw new ApplicationException(ErrorCode.TRACK_ALREADY_EXISTS);

        trackMapper.merge(track, request);
        track.setAlbum(getAlbum(request.getAlbumId()));
        track.setGenre(getGenre(request.getGenre()));
        setAudio(track, audio);
        trackRepository.save(track);

        return trackMapper.map(track);
    }

    private void setAudio(Track track, MultipartFile audio) throws IOException {
        if (audio == null) return;

        if (track.getAudioFilename() != null) {
            FileUtils.delete(applicationConfiguration.getAudioPath(), track.getAudioFilename());
        }

        final String audioFilename = IdUtils.newId() + "-" + audio.getOriginalFilename();
        track.setAudioFilename(audioFilename);

        final Path path = Paths.get(applicationConfiguration.getAudioPath()).resolve(audioFilename);
        audio.transferTo(path);
    }

    @Override
    public void delete(String id) throws ApplicationException {
        final Track track = trackRepository.findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
                .orElseThrow(() -> new ApplicationException(ErrorCode.NOT_FOUND));

        track.setEntityStatus(EntityStatus.DELETED);

        orderService.updateOrder(new TrackOrderId(
                track.getId(),
                track.getAlbum().getId()
        ));
        orderService.updateOrder(new TrackOrderId(
                track.getId(),
                track.getAlbum().getGroup().getId()
        ));

        trackRepository.save(track);
    }

    @Override
    public boolean checkExistsByName(String name, String albumId, String trackId) {
        final Track existed = trackRepository.findByNameAndEntityStatusAndAlbumId(name, EntityStatus.ACTIVE, albumId)
                .orElse(null);
        if (existed == null) return false;
        if (trackId == null || StringUtils.isBlank(trackId)) return true;
        return !StringUtils.equals(existed.getId(), trackId);
    }

    @Override
    public LikeResponse like(String id) throws ApplicationException {
        final Track track = trackRepository.findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
                .orElseThrow(() -> new ApplicationException(ErrorCode.NOT_FOUND));

        return likeService.like(track);
    }

    @Override
    public boolean save(String id) throws ApplicationException {
        final Track track = trackRepository.findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
                .orElseThrow(() -> new ApplicationException(ErrorCode.NOT_FOUND));

        return saveService.save(track);
    }

    private Genre getGenre(String name) {
        return genreService.getOrCreate(name);
    }

    private Album getAlbum(String id) throws ApplicationException {
        return albumRepository.findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
                .orElseThrow(() -> new ApplicationException(ErrorCode.NOT_FOUND));
    }

}
