package kr.uracle.smile.module.sleep;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class SleepLevels {
    private int id;
    private String sleepType;
    private int startTimeInSeconds;
    private int endTimeInSeconds;
}
