package kr.uracle.smile.module.exception;

/**
 * 요청에 대한 거절이 되었을때
 */
public class ApprovalRejectException extends RuntimeException {

    public ApprovalRejectException() {
        super("요청이 거절되었습니다.");
    }

    public ApprovalRejectException(String message) {
        super(message);
    }

    public ApprovalRejectException(String message, Throwable cause) {
        super(message, cause);
    }
}
