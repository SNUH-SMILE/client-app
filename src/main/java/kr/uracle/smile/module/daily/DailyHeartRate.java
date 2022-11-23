package kr.uracle.smile.module.daily;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class DailyHeartRate {
    private int id;
    private String timeOffsetHeartRateKey;
    private int timeOffsetHeartRateValue;
}
