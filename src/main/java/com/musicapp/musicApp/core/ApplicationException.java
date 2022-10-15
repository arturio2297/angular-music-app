package com.musicapp.musicApp.core;

import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class ApplicationException extends Throwable {
    private int code;

    public ApplicationException(int code) {
        this.code = code;
    }
}
