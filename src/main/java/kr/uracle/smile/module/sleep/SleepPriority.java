package kr.uracle.smile.module.sleep;

public enum SleepPriority {
    ENHANCED_FINAL(5),
    ENHANCED_TENTATIVE(4),
    AUTO_FINAL(3),
    AUTO_TENTATIVE(2),
    AUTO_MANUAL(1);

    private int code;

    SleepPriority(int code) {
        this.code = code;
    }

    public int value() {
        return code;
    }

    public static int getCode(String validation) {
        for (SleepPriority s : SleepPriority.values()) {
            if (s.toString().equals(validation)) return s.value();
        }
        return 1;
    }
}
