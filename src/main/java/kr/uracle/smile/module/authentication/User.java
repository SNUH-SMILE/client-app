package kr.uracle.smile.module.authentication;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class User {
    private int id;
    private String loginId;
    private String deviceId;
    private String garminId;
    private String userAccessToken;
    private String userAccessTokenSecret;
    private String userId;
    private String useYn;
    private LocalDateTime regDate;
    private LocalDateTime expireDate;
    private LocalDateTime modDate;
}
