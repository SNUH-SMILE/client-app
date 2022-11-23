package kr.uracle.smile.module.daily;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Daily {
    private int id;
    private int startTimeInSeconds;
    private String userAccessToken;
    private String userId;
}
