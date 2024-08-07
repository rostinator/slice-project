package cz.uhk.projectmgmt.service;

import java.util.Random;

public class CommonUtils {

    public static <T> T getRandomElement(T[] values) {
        return values[new Random().nextInt(values.length)];
    }

}
