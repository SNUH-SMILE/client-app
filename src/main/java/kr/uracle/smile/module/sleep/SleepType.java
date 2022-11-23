package kr.uracle.smile.module.sleep;

import lombok.Getter;

@Getter
public enum SleepType {
    DEEP("deep", 0),
    LIGHT("light", 1),
    AWAKE("awake", 2);

    private int code;
    private String type;
    private SleepType(String type, int code) {
        this.code = code;
        this.type = type;
    }

    public static int getTypeToCode(String sleepType) {
        for (SleepType s : SleepType.values()) {
            if (s.type.equals(sleepType)) {
                return s.code;
            }
        }
        return 2;
    }
}
