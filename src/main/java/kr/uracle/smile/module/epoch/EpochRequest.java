package kr.uracle.smile.module.epoch;

import kr.uracle.smile.module.common.HCSendAPIStatusCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@ToString
public class EpochRequest {

    @Getter
    @Setter
    private List<Epochs> epochs;

    @Getter
    @Setter
    @ToString
    public static class Epochs {
        private int id;
        private String summaryId;
        private double met;
        private int steps;
        private int activeKilocalories;
        private int activeTimeInSeconds;
        private String activityType;
        private double distanceInMeters;
        private int durationInSeconds;
        private String intensity;
        private double maxMotionIntensity;
        private double meanMotionIntensity;
        private int startTimeInSeconds;
        private int startTimeOffsetInSeconds;
        private String userAccessToken;
        private String userId;
    }

}