package com.musicapp.musicApp.core.message.common;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter@Setter
public class PageResponse<T> {
    private List<T> items;
    private long totalElements;
    private long totalPages;
    private int page;
    private int size;
}
