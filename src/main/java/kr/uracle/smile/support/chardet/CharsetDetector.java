package kr.uracle.smile.support.chardet;

import org.mozilla.universalchardet.CharsetListener;
import org.mozilla.universalchardet.Constants;
import org.mozilla.universalchardet.UniversalDetector;

import java.io.IOException;
import java.io.InputStream;

public class CharsetDetector {
    public static String detect(InputStream is, CharsetListener listener) throws CharsetNotFoundException {
        UniversalDetector detector = new UniversalDetector(listener);

        try {
            int size = 0;
            byte[] buf = new byte[4096];
            while ((size = is.read(buf)) > 0 && !detector.isDone()) {
                detector.handleData(buf, 0, size);

            }
            detector.dataEnd();

            if(detector.getDetectedCharset() == null) {
                listener.report(Constants.CHARSET_UTF_8);
            }
            return detector.getDetectedCharset();
        } catch (IOException e) {
            throw new CharsetNotFoundException("문자셋을 찾을 수 없습니다.", e);
        }
    }
}
