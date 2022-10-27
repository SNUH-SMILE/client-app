package kr.uracle.smile.support.chardet;

public class CharsetNotFoundException extends Exception {
    public CharsetNotFoundException() {
    }

    public CharsetNotFoundException(String message) {
        super(message);
    }

    public CharsetNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
