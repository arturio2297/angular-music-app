package com.musicapp.musicApp.utils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class FileUtils {

    public static boolean delete(String filePath, String filename) {
        Path path = Paths.get(filePath).resolve(filename);
        return delete(path);
    }

    public static boolean delete(Path path) {
        try {
            Files.delete(path);
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

}
