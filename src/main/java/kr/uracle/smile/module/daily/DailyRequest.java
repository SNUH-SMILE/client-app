package kr.uracle.smile.module.daily;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;
import java.util.Map;

@ToString
public class DailyRequest {

    @Getter
    @Setter
    private List<Dailies> dailies;

    @Getter
    @Setter
    @ToString
    public static class Dailies {
        private int id;
        private String summaryId;
        private String calendarDate;
        private int startTimeInSeconds;
        private int startTimeOffsetInSeconds;
        private String activityType;
        private int durationInSeconds;
        private int steps;
        private double distanceInMeters;
        private int activeTimeInSeconds;
        private int activeKilocalories;
        private int bmrKilocalories;
        private int moderateIntensityDurationInSeconds;
        private int vigorousIntensityDurationInSeconds;
        private int floorsClimbed;
        private int minHeartRateInBeatsPerMinute;
        private int averageHeartRateInBeatsPerMinute;
        private int maxHeartRateInBeatsPerMinute;
        private int restingHeartRateInBeatsPerMinute;
        private Map<String, Integer> timeOffsetHeartRateSamples;
        private int averageStressLevel;
        private int maxStressLevel;
        private int stressDurationInSeconds;
        private int restStressDurationInSeconds;
        private int activityStressDurationInSeconds;
        private int lowStressDurationInSeconds;
        private int mediumStressDurationInSeconds;
        private int highStressDurationInSeconds;
        private String stressQualifier;
        private int stepsGoal;
        private int intensityDurationGoalInSeconds;
        private int floorsClimbedGoal;
        private String userAccessToken;
        private String userId;
    }

    @Getter
    @Setter
    @ToString
    public static class TimeOffsetHeartRateSamples {
        private int id;
        private String timeOffsetHeartRateKey;
        private int timeOffsetHeartRateValue;
    }
}
