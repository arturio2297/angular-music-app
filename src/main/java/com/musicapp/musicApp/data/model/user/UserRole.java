package com.musicapp.musicApp.data.model.user;

import java.util.Arrays;

public class UserRole {
    public final static String ADMIN = "Admin";
    public final static String MODERATOR = "Moderator";
    public final static String USER = "User";

    public static boolean isDefined(String value) {
        return Arrays.asList(ADMIN, USER).contains(value);
    }
}
