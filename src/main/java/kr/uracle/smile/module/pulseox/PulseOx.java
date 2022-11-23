package kr.uracle.smile.module.pulseox;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PulseOx {
    private int id;
    private int startTimeInSeconds;
    private String userAccessToken;
    private String userId;
}
