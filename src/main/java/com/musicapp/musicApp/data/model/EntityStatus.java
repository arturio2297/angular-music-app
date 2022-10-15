package com.musicapp.musicApp.data.model;

import java.util.Arrays;

public class EntityStatus {
    public final static String ACTIVE = "Active";
    public final static String DELETED = "Deleted";
    public final static String BLOCKED = "Blocked";

    public static boolean isDefined(String value) {
        return Arrays.asList(ACTIVE, DELETED, BLOCKED).contains(value);
    }
}
