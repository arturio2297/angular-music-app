package com.musicapp.musicApp.services.album;

import com.musicapp.musicApp.configuration.application.ApplicationConfiguration;
import com.musicapp.musicApp.core.ApplicationException;
import com.musicapp.musicApp.core.contracts.AlbumService;
import com.musicapp.musicApp.core.contracts.LikeService;
import com.musicapp.musicApp.core.contracts.SaveService;
import com.musicapp.musicApp.core.contracts.TrackService;
import com.musicapp.musicApp.core.message.album.*;
import com.musicapp.musicApp.core.message.common.FileRequest;
import com.musicapp.musicApp.core.message.common.FileResponse;
import com.musicapp.musicApp.core.message.common.LikeResponse;
import com.musicapp.musicApp.core.message.common.PageResponse;
import com.musicapp.musicApp.core.message.error.ErrorCode;
import com.musicapp.musicApp.core.message.track.TrackAlbumFilterParameters;
import com.musicapp.musicApp.core.message.track.TrackFilterParameters;
import com.musicapp.musicApp.core.message.track.TrackItem;
import com.musicapp.musicApp.core.message.track_list.TrackListFilterParameters;
import com.musicapp.musicApp.data.model.EntityStatus;
import com.musicapp.musicApp.data.model.album.Album;
import com.musicapp.musicApp.data.model.group.Group;
import com.musicapp.musicApp.data.repositories.AlbumRepository;
import com.musicapp.musicApp.data.repositories.GroupRepository;
import com.musicapp.musicApp.data.repositories.TrackRepository;
import com.musicapp.musicApp.data.view.track.TrackAlbumView;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AlbumServiceImpl implements AlbumService {

    private final ApplicationConfiguration applicationConfiguration;
    private final AlbumRepository albumRepository;
    private final GroupRepository groupRepository;
    private final TrackRepository trackRepository;
    private final LikeService likeService;
    private final SaveService saveService;
    private final TrackService trackService;
    private final AlbumMapper albumMapper;
    private final EntityManager entityManager;

    @Override
    public PageResponse<AlbumItem> list(AlbumFilterParameters parameters) {
        final int page = Math.max(parameters.getPage(), 0);
        final int size = Math.max(parameters.getSize(), 1);

        final CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        final CriteriaQuery<Album> criteriaQuery = builder.createQuery(Album.class);
        final Root<Album> root = criteriaQuery.from(Album.class);

        Predicate whereClause = builder.equal(root.get("entityStatus"), EntityStatus.ACTIVE);

        if (parameters.getSearch() != null && !StringUtils.isBlank(parameters.getSearch())) {
            final String like = "%" + parameters.getSearch().toLowerCase() + "%";
            whereClause = builder.and(
                    whereClause,
                    builder.like(
                            builder.concat(
                                    builder.lower(root.get("name")),
                                    builder.lower(root.get("group").get("name"))
                            ), like)
            );
        }

        if (parameters.getGroupId() != null && !StringUtils.isBlank(parameters.getGroupId())) {
            whereClause = builder.and(
                    whereClause,
                    builder.equal(root.get("group").get("id"), parameters.getGroupId())
            );
        }

        criteriaQuery.where(whereClause);

        final String sort = (parameters.getSort() != null && !StringUtils.isBlank(parameters.getSort())) ?
                parameters.getSort() : "createdAt";
        final boolean isAscending = StringUtils.equalsIgnoreCase(parameters.getOrder(), "asc");
        criteriaQuery.orderBy(
                new OrderImpl(root.get(sort), isAscending)
        );
        criteriaQuery.orderBy(
                new OrderImpl(root.get(sort), isAscending)
        );

        final TypedQuery<Album> typedQuery = entityManager.createQuery(criteriaQuery);
        typedQuery.setMaxResults(size);
        typedQuery.setFirstResult(page * size);

        final List<Album> items = typedQuery.getResultList();

        final CriteriaQuery<Long> countQuery = builder.createQuery(Long.class);
        countQuery.select(builder.count(countQuery.from(Album.class)));

        countQuery.where(whereClause);

        final long totalElements = entityManager.createQuery(countQuery).getSingleResult();
        final long totalPages = (long) Math.ceil(1.0 * totalElements / size);

        final PageResponse<AlbumItem> response = new PageResponse<>();
        response.setPage(page);
        response.setSize(size);
        response.setTotalPages(totalPages);
        response.setTotalElements(totalElements);
        response.setItems(
                albumMapper.map(items).stream().map(x -> {
                    if (parameters.getTracksCount() <= 0) {
                        x.setTracks(new ArrayList<>());
                        return x;
                    }

                        final TrackFilterParameters trackParameters = new TrackFilterParameters();
                        trackParameters.setSize(parameters.getTracksCount());
                        trackParameters.setAlbumId(x.getId());
                        x.setTracks(trackService.list(trackParameters).getItems());

                        return x;
                }).collect(Collectors.toList())
        );

        return response;
    }

    @Override
    public PageResponse<TrackItem> tracks(TrackAlbumFilterParameters parameters) {
        final int page = Math.max(parameters.getPage(), 0);
        final int size = Math.max(parameters.getSize(), 1);

        final CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        final CriteriaQuery<TrackAlbumView> criteriaQuery = builder.createQuery(TrackAlbumView.class);
        final Root<TrackAlbumView> root = criteriaQuery.from(TrackAlbumView.class);

        Predicate whereClause = builder.equal(root.get("entityStatus"), EntityStatus.ACTIVE);

        if (parameters.getSearch() != null && !StringUtils.isBlank(parameters.getSearch())) {
            final String like = "%" + parameters.getSearch().toLowerCase() + "%";
            whereClause = builder.and(
                    whereClause,
                    builder.like(builder.lower(root.get("name")), like)
            );
        }

        whereClause = builder.and(
                whereClause,
                builder.equal(root.get("albumId"), parameters.getAlbumId())
        );

        criteriaQuery.where(whereClause);

        criteriaQuery.orderBy(
                new OrderImpl(root.get("order"), true)
        );

        final TypedQuery<TrackAlbumView> typedQuery = entityManager.createQuery(criteriaQuery);
        typedQuery.setMaxResults(size);
        typedQuery.setFirstResult(page * size);

        final List<TrackAlbumView> items = typedQuery.getResultList();

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
        response.setItems(albumMapper.mapTrack(items));

        return response;
    }

    @Override
    public AlbumResponse get(String id) throws ApplicationException {
        final Album album = albumRepository.findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
                .orElseThrow(() -> new ApplicationException(ErrorCode.NOT_FOUND));

        final AlbumResponse response = new AlbumResponse();
        albumMapper.merge(album, response);
        return response;
    }

    @Override
    public FileResponse getImage(String id) throws ApplicationException, IOException {
        final Album album = albumRepository.findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
                .orElseThrow(() -> new ApplicationException(ErrorCode.NOT_FOUND));

        if (album.getImageFilename() == null)
            throw new ApplicationException(ErrorCode.NOT_FOUND);

        final Path path = Paths.get(applicationConfiguration.getImagesPath()).resolve(album.getImageFilename());
        final FileResponse response = new FileResponse();

        response.setResource(new UrlResource(path.toUri().toURL()));
        response.setContentType(Files.probeContentType(path));

        return response;
    }

    @Override
    public AlbumResponse add(AddAlbumRequest request, MultipartFile image) throws ApplicationException, IOException {
        final Album existed = albumRepository.findByNameAndEntityStatusAndGroupId(
                request.getName(), EntityStatus.ACTIVE, request.getGroupId()
        ).orElse(null);

        if (existed != null)
            throw new ApplicationException(ErrorCode.ALBUM_ALREADY_EXISTS);

        final Album album = new Album();

        album.setId(IdUtils.newId());
        album.setEntityStatus(EntityStatus.ACTIVE);
        album.setCreatedAt(OffsetDateTime.now());
        album.setGroup(getGroup(request.getGroupId()));
        albumMapper.merge(album, request);
        setImage(album, request.getImage(), image);

        albumRepository.save(album);

        final AlbumResponse response = new AlbumResponse();
        albumMapper.merge(album, response);

        return response;
    }

    @Override
    public AlbumResponse update(String id, UpdateAlbumRequest request, MultipartFile image) throws ApplicationException, IOException {
        final Album album = albumRepository.findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
                .orElseThrow(() -> new ApplicationException(ErrorCode.NOT_FOUND));

        final Album existed = albumRepository.findByNameAndEntityStatusAndGroupId(
                request.getName(),
                EntityStatus.ACTIVE,
                request.getGroupId()
        ).orElse(null);

        if (existed != null && !StringUtils.equals(existed.getId(), id))
            throw new ApplicationException(ErrorCode.ALBUM_ALREADY_EXISTS);

        album.setLastUpdatedAt(OffsetDateTime.now());
        album.setGroup(getGroup(request.getGroupId()));
        albumMapper.merge(album, request);
        setImage(album, request.getImage(), image);

        albumRepository.save(album);

        final AlbumResponse response = new AlbumResponse();
        albumMapper.merge(album, response);

        return response;
    }

    private void setImage(Album album, FileRequest request, MultipartFile image) throws IOException {
        if (request == null && image == null) return;

        final String filename = image != null ? image.getOriginalFilename() : request.getFilename();
        final byte[] content = image != null ? image.getBytes() : Base64Utils.encode(request.getBase64());

        final String imageFilename = IdUtils.newId() + "-" + filename;
        album.setImageFilename(imageFilename);
        final Path path = Paths.get(applicationConfiguration.getImagesPath()).resolve(imageFilename);
        Files.write(path, content);
    }

    @Override
    public void delete(String id) throws ApplicationException {
        final Album album = albumRepository.findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
                .orElseThrow(() -> new ApplicationException(ErrorCode.NOT_FOUND));

        album.setEntityStatus(EntityStatus.DELETED);
        albumRepository.save(album);

        album.getTracks().forEach(track -> {
            track.setEntityStatus(EntityStatus.DELETED);
            trackRepository.save(track);
        });
    }

    @Override
    public boolean checkExistsByName(String name, String groupId, String albumId) {
        final Album existed = albumRepository.findByNameAndEntityStatusAndGroupId(name, EntityStatus.ACTIVE, groupId)
                .orElse(null);
        if (existed == null) return false;
        if (albumId == null || StringUtils.isBlank(albumId)) return true;
        return !StringUtils.equals(existed.getId(), albumId);
    }

    @Override
    public LikeResponse like(String id) throws ApplicationException {
        final Album album = albumRepository.findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
                .orElseThrow(() -> new ApplicationException(ErrorCode.NOT_FOUND));

        return likeService.like(album);
    }

    @Override
    public boolean save(String id) throws ApplicationException {
        final Album album = albumRepository.findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
                .orElseThrow(() -> new ApplicationException(ErrorCode.NOT_FOUND));

        return saveService.save(album);
    }

    private Group getGroup(String id) throws ApplicationException {
        return groupRepository.findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
                .orElseThrow(() -> new ApplicationException(ErrorCode.NOT_FOUND));
    }

}
