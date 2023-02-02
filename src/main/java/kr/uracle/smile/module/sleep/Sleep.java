package kr.uracle.smile.module.sleep;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Sleep {
    private int id;
    private int startTimeInSeconds;
    private String userAccessToken;
    private String userId;
    private int durationInSeconds;
    private String validation;
    private String calendarDate;
}
