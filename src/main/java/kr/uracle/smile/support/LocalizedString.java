package kr.uracle.smile.support;

public class LocalizedString {

	public final static String OK = "200";
    public final static String BAD_REQUEST = "400";
    public final static String MALFORMED_JSON = "400.malformed.json";
    public final static String UNAUTHORIZED = "401";
    public final static String BAD_CREDENTIALS = "401.bad.credentials";
    public final static String ACCESS_DENIED = "403.access.denied";
    public final static String UNPROCESSABLE_REQUEST = "422";
    public final static String SERVER_ERROR = "500";
   
	// 공통
    public final static String EXCEPTION_WHILE_PROCESSING = "exception.while.processing";
    public final static String EMPTY_FILE = "empty.file";
    public final static String MISSING_REQUEST = "missing.request";

    public final static String NO_SUCH_ADMIN = "admin.no.such";
    public final static String PARAMETER_REQUIRED_MESSAGE = "{parameter.required.message}";
    public final static String EXISTS_DATA = "exists.data";

    public final static String ATTACH_CSV_FILE = "attach.csv.file";
    public final static String ATTACH_IMAGE_FILE = "attach.image.file";
    public final static String ATTACH_FILE_NOT_FOUND = "attach.file.not.found";
    public final static String ATTACH_FILE_WRITE_ERROR = "attach.file.write.error";

    // 입력 값 검증 실패시 메시지
    public final static String REQUEST_PARAMETER_VALIDATION_FAILED = "common.parameter.validation.failed";
    public final static String REQUEST_PARAMETER_BLANK_CONTAIN_FAILED = "common.parameter.blank.contain.failed";
    
    // 로그인
    public final static String ADMIN_PASSWORD_UPDATE_SUCCESS = "admin.password.update.success";
    public final static String ADMIN_PASSWORD_CHECK_FAIL = "admin.password.check.fail";
    public final static String ADMIN_PASSWORD_BEFORE_CHECK_FAIL = "admin.password.before.check.fail";
    public final static String ADMIN_PASSWORD_= "admin.password.before.check.fail";
    
    /**
     * 기본 생성자
     */
    private LocalizedString() {
    }
}
