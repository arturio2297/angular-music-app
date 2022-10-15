package com.musicapp.musicApp.core.message.error;

import java.util.HashMap;
import java.util.Map;

public class ErrorResponses {

    private final static ErrorResponse UNKNOWN = new ErrorResponse(ErrorCode.UNKNOWN, ErrorMessage.UNKNOWN);
    private final static ErrorResponse NOT_FOUND = new ErrorResponse(ErrorCode.NOT_FOUND, ErrorMessage.NOT_FOUND);
    private final static ErrorResponse FORBIDDEN = new ErrorResponse(ErrorCode.FORBIDDEN, ErrorMessage.FORBIDDEN);

    private final static ErrorResponse USER_ALREADY_EXISTS = new ErrorResponse(ErrorCode.USER_ALREADY_EXISTS, ErrorMessage.USER_ALREADY_EXISTS);

    private final static ErrorResponse GROUP_ALREADY_EXISTS = new ErrorResponse(ErrorCode.GROUP_ALREADY_EXISTS, ErrorMessage.GROUP_ALREADY_EXISTS);

    private final static ErrorResponse ALBUM_ALREADY_EXISTS = new ErrorResponse(ErrorCode.ALBUM_ALREADY_EXISTS, ErrorMessage.ALBUM_ALREADY_EXISTS);

    private final static ErrorResponse TRACK_ALREADY_EXISTS = new ErrorResponse(ErrorCode.TRACK_ALREADY_EXISTS, ErrorMessage.TRACK_ALREADY_EXISTS);

    private static Map<Integer, ErrorResponse> errors = new HashMap<Integer, ErrorResponse>() {{
        put(ErrorCode.UNKNOWN, UNKNOWN);
        put(ErrorCode.NOT_FOUND, NOT_FOUND);
        put(ErrorCode.FORBIDDEN, FORBIDDEN);

        put(ErrorCode.USER_ALREADY_EXISTS, USER_ALREADY_EXISTS);

        put(ErrorCode.GROUP_ALREADY_EXISTS, GROUP_ALREADY_EXISTS);

        put(ErrorCode.ALBUM_ALREADY_EXISTS, ALBUM_ALREADY_EXISTS);

        put(ErrorCode.TRACK_ALREADY_EXISTS, TRACK_ALREADY_EXISTS);
    }};

    public static ErrorResponse get(int code) {
        return errors.getOrDefault(code, UNKNOWN);
    }

}
