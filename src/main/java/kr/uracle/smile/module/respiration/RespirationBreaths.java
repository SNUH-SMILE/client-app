package kr.uracle.smile.module.respiration;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class RespirationBreaths {
    private int id;
    private String timeOffsetEpochToBreathsKey;
    private int timeOffsetEpochToBreathsValue;
}
