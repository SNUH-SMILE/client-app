package kr.uracle.smile.module.respiration;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;

@ToString
@Slf4j
public class RespirationRequest {

    @Getter
    @Setter
    private List<Respirations> allDayRespiration;

    @Getter
    @Setter
    @ToString
    public static class Respirations {
        private int id;
        private String summaryId;
        private int startTimeInSeconds;
        private int durationInSeconds;
        private int startTimeOffsetInSeconds;
        private Map<String, Double> timeOffsetEpochToBreaths;
        private String userAccessToken;
        private String userId;
    }

    @Getter
    @Setter
    @ToString
    public static class TimeOffsetEpochToBreaths {
        private int id;
        private String timeOffsetEpochToBreathsKey;
        private double timeOffsetEpochToBreathsValue;
    }
}
