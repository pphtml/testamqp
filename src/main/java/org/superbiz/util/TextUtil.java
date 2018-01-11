package org.superbiz.util;

public class TextUtil {
    public static final String slugify(String source) {
        return source.toLowerCase().replace('_', '-');
    }
}
