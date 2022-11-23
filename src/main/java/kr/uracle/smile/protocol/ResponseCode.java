package kr.uracle.smile.protocol;

import lombok.Getter;

import java.util.Arrays;
@Getter
public enum ResponseCode {
    Ok(200),
    BadRequest(400),
    Unauthorized(401),
    AccessDenied(403),
    ForceChangePassword(402),
    NotFound(404),
    UnprocessableRequest(422),
    ServerError(500),
    Unknown(999);

    private int code;

    ResponseCode(int code) {
        this.code = code;
    }

    public static ResponseCode of(int code) {
        return Arrays.stream(ResponseCode.values()).filter(v -> v.value() == code)
                .findFirst().orElseGet(() -> ResponseCode.Unknown);
    }

    public int value() {
        return this.code;
    }
}
