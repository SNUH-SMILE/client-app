package kr.uracle.smile.protocol;

import io.swagger.annotations.ApiModelProperty;
import org.springframework.lang.Nullable;

public class Response<T> {
    @ApiModelProperty(value = "응답 코드")
    private int code;
    @ApiModelProperty(value = "응답 메시지")
    private String message;
    @ApiModelProperty(value = "데이터", required = false)
    private T result;

    public Response(ResponseCode code, String message) {
        this.code = code.value();
        this.message = message;
    }

    public Response(int code, String message, @Nullable T result) {
        this.code = code;
        this.message = message;
        this.result = result;
    }

    public int getCode() {
        return code;
    }

    public void setCode(ResponseCode code) {
        this.code = code.value();
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getResult() {
        return result;
    }

    public void setResult(@Nullable T result) {
        this.result = result;
    }

    @Override
    public String toString() {
        return "Response{" +
                "code=" + code +
                ", message='" + message + '\'' +
                ", result=" + result +
                '}';
    }
}
