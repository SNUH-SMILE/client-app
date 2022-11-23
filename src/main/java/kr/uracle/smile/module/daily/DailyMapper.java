package kr.uracle.smile.module.daily;

import kr.uracle.smile.module.common.HCSendAPIStatusCode;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DailyMapper {

    int addDaily(DailyRequest.Dailies param);

    int addTimeOffsetHeartRateSamples(DailyRequest.TimeOffsetHeartRateSamples param);

    int editDailySendCode(HCSendAPIStatusCode param);

    int editDailySendCodeFlag();

    List<Daily> getHCDaily();

    List<DailyHeartRate> getHCDailyTimeOffsetHeartRate(int id);
}
