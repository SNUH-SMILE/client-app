package kr.uracle.smile.module.epoch;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Epoch {
    private int id;
    private int steps;
    private double distanceInMeters;
    private int startTimeInSeconds;
    private int startTimeOffsetInSeconds;
    private String userAccessToken;
    private String userId;
}
