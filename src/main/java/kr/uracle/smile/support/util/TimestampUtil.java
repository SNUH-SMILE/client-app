package kr.uracle.smile.support.util;

import java.text.SimpleDateFormat;
import java.util.Date;

public class TimestampUtil {
    public static String timestampToDate(int timestamp, String format) {
        Date date = new Date(timestamp*1000L);
        SimpleDateFormat sdf = new SimpleDateFormat( format );
        return sdf.format( date );
    }
}
