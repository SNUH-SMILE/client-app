package kr.uracle.smile.module.healthsnapshot;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;
import java.util.Map;

@ToString
public class HealthSnapshots {

    @Getter
    @Setter
    private List<HealthSnapshot> healthSnapshots;

    @Getter
    @Setter
    @ToString
    public static class HealthSnapshot {
        private int id;
        private String summaryId;
        private String calendarDate;
        private int durationInSeconds;
        private int startTimeInSeconds;
        private int startTimeOffsetInSeconds;
        private String userAccessToken;
        private String userId;
        private List<HealthSnapshotSummary> summaries;
    }

    @Getter
    @Setter
    @ToString
    public static class HealthSnapshotSummary {
        private int id;
        private int snapshotId;
        private String summaryType;
        private double avgValue;
        private double minValue;
        private double maxValue;
        private Map<String, Double> epochSummaries;
    }

    @Getter
    @Setter
    @ToString
    public static class HealthSnapshotSummaryEpoch {
        private int id;
        private double epochSummariesValue;
        private String epochSummariesKey;
    }
}
