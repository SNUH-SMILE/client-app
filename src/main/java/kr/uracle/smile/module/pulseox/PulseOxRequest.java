package kr.uracle.smile.module.pulseox;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;
import java.util.Map;

@ToString
public class PulseOxRequest {

    @Getter
    @Setter
    private List<PulseOxs> pulseox;

    @Getter
    @Setter
    @ToString
    public static class PulseOxs {
        private int id;
        private String summaryId;
        private String calendarDate;
        private int startTimeInSeconds;
        private int startTimeOffsetInSeconds;
        private int durationInSeconds;
        private Map<String, Integer> timeOffsetSpo2Values;
        private String onDemand;
        private String userAccessToken;
        private String userId;
    }

    @Getter
    @Setter
    @ToString
    public static class PulseOxTimeOffsetSpo2Values {
        private int id;
        private int timeOffsetSpo2Values;
        private String timeOffsetSpo2ValuesKey;
    }
}
