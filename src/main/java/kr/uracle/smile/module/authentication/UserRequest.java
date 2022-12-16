package kr.uracle.smile.module.authentication;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
public class UserRequest {

    @Getter
    @Setter
    public static class Delete {
        private String loginId;
    }

    @Getter
    @Setter
    @ToString
    public static class addSeers {
        private String loginId;
        private String deviceId;
        private String additionUserCode;
    }
}
