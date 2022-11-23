package kr.uracle.smile.module.bloodpressure;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import java.util.List;

@ToString
public class BloodPressures {

    @Getter
    @Setter
    private List<BloodPressure> bloodPressures;

    @Getter
    @Setter
    @ToString
    public static class BloodPressure {
        private int id;
        private String summaryId;
        private int measurementTimeInSeconds;
        private int measurementTimeOffsetInSeconds;
        private int systolic;
        private int diastolic;
        private int pulse;
        private String sourceType;
        private String userAccessToken;
        private String userId;
    }
}