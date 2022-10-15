package com.musicapp.musicApp.utils;

import java.util.Base64;

public class Base64Utils {

    public static byte[] encode(String content) {
        final String base64 = content.split("base64,")[1];
        return Base64.getDecoder().decode(base64);
    }

}
