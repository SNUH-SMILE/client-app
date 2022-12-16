package kr.uracle.smile.module.temperature;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class Temperature {
    private int id;
    private String loginId;
    private String additionUserCode;
    private LocalDateTime measurementDate;
    private float temperature;
    private int trend;
    private int emergency;
}
