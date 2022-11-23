package kr.uracle.smile.support.util;

import org.springframework.web.util.UriUtils;
import java.nio.charset.StandardCharsets;
public class EncodingUtils {

    public static String getPercentDecoded(String value) {
        return UriUtils.decode(value, StandardCharsets.UTF_8);
    }

    public static String getPercentEncoded(String value) {
        return UriUtils.encode(value, StandardCharsets.UTF_8);
    }
}
