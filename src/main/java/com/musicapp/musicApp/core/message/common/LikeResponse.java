package com.musicapp.musicApp.core.message.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter@Setter
@AllArgsConstructor
public class LikeResponse {
    private boolean liked;
    private long likesCount;
}
