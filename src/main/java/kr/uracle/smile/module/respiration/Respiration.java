package kr.uracle.smile.module.respiration;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Respiration {
    private int id;
    private int startTimeInSeconds;
    private String userAccessToken;
    private String userId;
}
