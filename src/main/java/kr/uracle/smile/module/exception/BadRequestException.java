package kr.uracle.smile.module.exception;

/**
 * 사용자의 잘못된 요청에 대한 오류
 */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }

}
