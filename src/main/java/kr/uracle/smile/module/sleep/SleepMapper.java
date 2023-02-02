package kr.uracle.smile.module.sleep;

import kr.uracle.smile.module.common.HCSendAPIStatusCode;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SleepMapper {

    int addSleep(SleepRequest.Sleeps param);

    int addSleepLevelMap(SleepRequest.SleepLevelsMap param);

    int addTimeRespiration(SleepRequest.TimeOffsetSleepRespiration param);

    int addTimeSPO2(SleepRequest.TimeOffsetSleepSpo2 param);

    int editSleepSendCode(HCSendAPIStatusCode param);

    int editSleepSendCodeFlag();

    List<Sleep> getHCSleep();

    List<SleepLevels> getHCSleepLevels(int id);

    List<Sleep> getSleepToday(@Param("userAccessToken") String userAccessToken, @Param("calendarDate") String calendarDate);

}
