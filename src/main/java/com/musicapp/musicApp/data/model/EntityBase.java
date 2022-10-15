package com.musicapp.musicApp.data.model;

import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import java.time.OffsetDateTime;

@Getter@Setter
@MappedSuperclass
public class EntityBase {

    @Id
    @Column(length = 32)
    private String id;

    @Column(name = "name")
    private String name;

    @Column(name = "entity_status", length = 10, nullable = false)
    private String entityStatus;

    @Column(name = "created_at", nullable = true)
    private OffsetDateTime createdAt;

    @Column(name = "last_updated_at", nullable = true)
    private OffsetDateTime lastUpdatedAt;

    public boolean isActive() {
        return StringUtils.equals(entityStatus, EntityStatus.ACTIVE);
    }

    public boolean isBlocked() {
        return StringUtils.equals(entityStatus, EntityStatus.BLOCKED);
    }

    public boolean isDeleted() {
        return StringUtils.equals(entityStatus, EntityStatus.DELETED);
    }

}
