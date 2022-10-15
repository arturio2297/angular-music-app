package com.musicapp.musicApp.services.group;

import com.musicapp.musicApp.configuration.application.ApplicationConfiguration;
import com.musicapp.musicApp.core.ApplicationException;
import com.musicapp.musicApp.core.contracts.GroupService;
import com.musicapp.musicApp.core.contracts.TrackService;
import com.musicapp.musicApp.core.message.common.FileRequest;
import com.musicapp.musicApp.core.message.common.FileResponse;
import com.musicapp.musicApp.core.message.common.PageResponse;
import com.musicapp.musicApp.core.message.error.ErrorCode;
import com.musicapp.musicApp.core.message.group.*;
import com.musicapp.musicApp.core.message.track.TrackFilterParameters;
import com.musicapp.musicApp.core.message.track.TrackGroupFilterParameters;
import com.musicapp.musicApp.core.message.track.TrackItem;
import com.musicapp.musicApp.data.model.EntityStatus;
import com.musicapp.musicApp.data.model.group.Group;
import com.musicapp.musicApp.data.repositories.AlbumRepository;
import com.musicapp.musicApp.data.repositories.GroupRepository;
import com.musicapp.musicApp.data.repositories.TrackRepository;
import com.musicapp.musicApp.data.view.track.TrackAlbumView;
import com.musicapp.musicApp.data.view.track.TrackGroupView;
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
public class GroupServiceImpl implements GroupService {

    private final ApplicationConfiguration applicationConfiguration;
    private final GroupRepository groupRepository;
    private final AlbumRepository albumRepository;
    private final TrackRepository trackRepository;
    private final TrackService trackService;
    private final GroupMapper groupMapper;
    private final EntityManager entityManager;

    @Override
    public PageResponse<GroupItem> list(GroupFilterParameters parameters) {
        final int page = Math.max(parameters.getPage(), 0);
        final int size = Math.max(parameters.getSize(), 1);

        final CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        final CriteriaQuery<Group> criteriaQuery = builder.createQuery(Group.class);
        final Root<Group> root = criteriaQuery.from(Group.class);

        Predicate whereClause = builder.equal(root.get("entityStatus"), EntityStatus.ACTIVE);

        if (parameters.getSearch() != null && !StringUtils.isBlank(parameters.getSearch())) {
            final String like = "%" + parameters.getSearch().toLowerCase() + "%";
            whereClause = builder.and(
                    whereClause,
                    builder.like(builder.lower(root.get("name")), like)
            );
        }

        criteriaQuery.where(whereClause);

        criteriaQuery.orderBy(
                new OrderImpl(root.get("createdAt"), true)
        );

        final TypedQuery<Group> typedQuery = entityManager.createQuery(criteriaQuery);
        typedQuery.setMaxResults(size);
        typedQuery.setFirstResult(page * size);

        final List<Group> items = typedQuery.getResultList();

        final CriteriaQuery<Long> countQuery = builder.createQuery(Long.class);
        countQuery.select(builder.count(countQuery.from(Group.class)));

        countQuery.where(whereClause);

        final long totalElements = entityManager.createQuery(countQuery).getSingleResult();
        final long totalPages = (long) Math.ceil(1.0 * totalElements / size);

        final PageResponse<GroupItem> response = new PageResponse<>();
        response.setPage(page);
        response.setSize(size);
        response.setTotalPages(totalPages);
        response.setTotalElements(totalElements);
        response.setItems(
                groupMapper.map(items).stream().map(x -> {
                    if (parameters.getTracksCount() <= 0) {
                        x.setTracks(new ArrayList<>());
                        return x;
                    }

                    final TrackFilterParameters trackParameters = new TrackFilterParameters();
                    trackParameters.setSize(parameters.getTracksCount());
                    trackParameters.setGroupId(x.getId());
                    x.setTracks(trackService.list(trackParameters).getItems());

                    return x;
                }).collect(Collectors.toList())
        );

        return response;
    }

    @Override
    public PageResponse<TrackItem> tracks(TrackGroupFilterParameters parameters) {
        final int page = Math.max(parameters.getPage(), 0);
        final int size = Math.max(parameters.getSize(), 1);

        final CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        final CriteriaQuery<TrackGroupView> criteriaQuery = builder.createQuery(TrackGroupView.class);
        final Root<TrackGroupView> root = criteriaQuery.from(TrackGroupView.class);

        Predicate whereClause = builder.equal(root.get("entityStatus"), EntityStatus.ACTIVE);

        if (parameters.getSearch() != null && !StringUtils.isBlank(parameters.getSearch())) {
            final String like = "%" + parameters.getSearch().toLowerCase() + "%";
            Expression<String> searchExp = builder.concat(
                    builder.lower(root.get("name")),
                    builder.lower(root.get("albumName"))
            );
            whereClause = builder.and(
                    whereClause,
                    builder.like(searchExp, like)
            );
        }

        whereClause = builder.and(
                whereClause,
                builder.equal(root.get("groupId"), parameters.getGroupId())
        );

        criteriaQuery.where(whereClause);

        criteriaQuery.orderBy(
                new OrderImpl(root.get("order"), true)
        );

        final TypedQuery<TrackGroupView> typedQuery = entityManager.createQuery(criteriaQuery);
        typedQuery.setMaxResults(size);
        typedQuery.setFirstResult(page * size);

        final List<TrackGroupView> items = typedQuery.getResultList();

        final CriteriaQuery<Long> countQuery = builder.createQuery(Long.class);
        countQuery.select(builder.count(countQuery.from(TrackGroupView.class)));

        countQuery.where(whereClause);

        final long totalElements = entityManager.createQuery(countQuery).getSingleResult();
        final long totalPages = (long) Math.ceil(1.0 * totalElements / size);

        final PageResponse<TrackItem> response = new PageResponse<>();
        response.setPage(page);
        response.setSize(size);
        response.setTotalPages(totalPages);
        response.setTotalElements(totalElements);
        response.setItems(groupMapper.mapTrack(items));

        return response;
    }

    @Override
    public GroupResponse get(String id) throws ApplicationException {
        final Group group = groupRepository.findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
                .orElseThrow(() -> new ApplicationException(ErrorCode.NOT_FOUND));

        final GroupResponse response = new GroupResponse();
        groupMapper.merge(group, response);

        return response;
    }

    @Override
    public FileResponse getImage(String id) throws ApplicationException, IOException {
        final Group group = groupRepository.findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
                .orElseThrow(() -> new ApplicationException(ErrorCode.NOT_FOUND));

        if (group.getImageFilename() == null)
            throw new ApplicationException(ErrorCode.NOT_FOUND);

        final Path path = Paths.get(applicationConfiguration.getImagesPath()).resolve(group.getImageFilename());
        final FileResponse response = new FileResponse();

        response.setResource(new UrlResource(path.toUri().toURL()));
        response.setContentType(Files.probeContentType(path));

        return response;
    }

    @Override
    public GroupResponse add(AddGroupRequest request, MultipartFile image) throws ApplicationException, IOException {
        final Group existed = groupRepository.findByNameAndEntityStatus(request.getName(), EntityStatus.ACTIVE)
                .orElse(null);

        if (existed != null)
            throw new ApplicationException(ErrorCode.GROUP_ALREADY_EXISTS);

        final Group group = new Group();
        group.setId(IdUtils.newId());
        group.setEntityStatus(EntityStatus.ACTIVE);
        group.setCreatedAt(OffsetDateTime.now());
        groupMapper.merge(group, request);
        setImage(group, request.getImage(), image);

        groupRepository.save(group);

        final GroupResponse response = new GroupResponse();
        groupMapper.merge(group, request);

        return response;
    }

    @Override
    public GroupResponse update(String id, UpdateGroupRequest request, MultipartFile image) throws ApplicationException, IOException {
        final Group group = groupRepository.findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
                .orElseThrow(() -> new ApplicationException(ErrorCode.NOT_FOUND));

        final Group existedByName = groupRepository.findByNameAndEntityStatus(request.getName(), EntityStatus.ACTIVE)
                .orElse(null);

        if (existedByName != null && !StringUtils.equals(existedByName.getId(), group.getId()))
            throw new ApplicationException(ErrorCode.GROUP_ALREADY_EXISTS);

        group.setLastUpdatedAt(OffsetDateTime.now());
        groupMapper.merge(group, request);
        setImage(group, request.getImage(), image);
        groupRepository.save(group);

        final GroupResponse response = new GroupResponse();
        groupMapper.merge(group, response);

        return response;
    }

    private void setImage(Group group, FileRequest request, MultipartFile image) throws IOException {
        if (request == null && image == null) return;

        final String filename = image != null ? image.getOriginalFilename() : request.getFilename();
        final byte[] content = image != null ? image.getBytes() : Base64Utils.encode(request.getBase64());

        final String imageFilename = IdUtils.newId() + "-" + filename;
        group.setImageFilename(imageFilename);
        final Path path = Paths.get(applicationConfiguration.getImagesPath()).resolve(imageFilename);
        Files.write(path, content);
    }

    @Override
    public void delete(String id) throws ApplicationException {
        final Group group = groupRepository.findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
                .orElseThrow(() -> new ApplicationException(ErrorCode.NOT_FOUND));

        group.setEntityStatus(EntityStatus.DELETED);
        groupRepository.save(group);

        group.getAlbums().forEach(album -> {
            album.setEntityStatus(EntityStatus.DELETED);
            albumRepository.save(album);
            album.getTracks().forEach(track -> {
                track.setEntityStatus(EntityStatus.DELETED);
                trackRepository.save(track);
            });
        });
    }

    @Override
    public boolean checkExistsByName(String name, String id) {
        final Group existed = groupRepository.findByNameAndEntityStatus(name, EntityStatus.ACTIVE)
                .orElse(null);
        if (existed == null) return false;
        if (id == null || StringUtils.isBlank(id)) return true;
        return !StringUtils.equals(existed.getId(), id);
    }

}
