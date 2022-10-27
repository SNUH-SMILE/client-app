package kr.uracle.smile.module.exception;

/**
 * 정상적인 요청이지만 처리할 수 없는 상황에 대한 오류
 */
public class UnprocessableRequestException extends RuntimeException {

    public UnprocessableRequestException() {
        super("요청을 처리할 수 없습니다.");
    }

    public UnprocessableRequestException(String message) {
        super(message);
    }

    public UnprocessableRequestException(String message, Throwable cause) {
        super(message, cause);
    }
}
