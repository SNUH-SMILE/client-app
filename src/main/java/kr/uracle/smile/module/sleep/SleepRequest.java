package kr.uracle.smile.module.sleep;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;
import java.util.Map;

@ToString
public class SleepRequest {

    @Getter
    @Setter
    private List<Sleeps> sleeps;

    @Getter
    @Setter
    @ToString
    public static class Sleeps {
        private int id;
        private String summaryId;
        private String calendarDate;
        private int durationInSeconds;
        private int startTimeInSeconds;
        private int startTimeOffsetInSeconds;
        private int unmeasurableSleepDurationInSeconds;
        private int deepSleepDurationInSeconds;
        private int lightSleepDurationInSeconds;
        private int remSleepInSeconds;
        private int awakeDurationInSeconds;
        private Map<String, List<SleepRequest.SleepLevelsMap>> sleepLevelsMap;
        private String validation;
        private Map<String, String> timeOffsetSleepRespiration;
        private Map<String, String> timeOffsetSleepSpo2;
        private String userAccessToken;
        private String userId;
    }

    @Getter
    @Setter
    @ToString
    public static class SleepLevelsMap {
        private int id;
        private String sleepType;
        private int startTimeInSeconds;
        private int endTimeInSeconds;
    }

    @Getter
    @Setter
    @ToString
    public static class TimeOffsetSleepRespiration {
        private int id;
        private String timeOffsetSleepRespiration;
        private String timeOffsetSleepRespirationKey;
    }

    @Getter
    @Setter
    @ToString
    public static class TimeOffsetSleepSpo2 {
        private int id;
        private String timeOffsetSleepSPO2;
        private String timeOffsetSleepSPO2Key;
    }

}
