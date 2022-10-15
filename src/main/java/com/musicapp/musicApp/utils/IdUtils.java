package com.musicapp.musicApp.utils;

import java.util.UUID;

public class IdUtils {

    public static String newId() {
        return UUID.randomUUID().toString().replaceAll("-", "");
    }

}
