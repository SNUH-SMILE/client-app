package kr.uracle.smile.module.sleep;

import kr.uracle.smile.module.authentication.User;
import kr.uracle.smile.module.authentication.UserMapper;
import kr.uracle.smile.module.common.HCHttpClient;
import kr.uracle.smile.module.common.HCSendAPIStatusCode;
import kr.uracle.smile.support.util.TimestampUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class SleepService {

    @Value("${healthConnect.url.sleep}")
    private String hcSleepURL;

    @Autowired
    private SleepMapper sleepMapper;

    @Autowired
    private UserMapper userMapper;

    @Transactional
    public void addSleep(SleepRequest sleeps) {
        for (SleepRequest.Sleeps sleep : sleeps.getSleeps()) {
            // SLEEP 테이블 INSERT
            sleepMapper.addSleep(sleep);

            // SLEEP KEY 값
            int sleepId = sleep.getId();

            // SLEEP_LEVELS_MAP 테이블 INSERT
            if (sleep.getSleepLevelsMap() != null) {
                addSleepLevelMap(sleepId, sleep.getSleepLevelsMap());
            }

            // 미사용 주석 처리 SLEEP_TIME_OFFSET_RESPIRATION 테이블 INSERT
//            if (sleep.getTimeOffsetSleepRespiration() != null) {
//                addTimeRespiration(sleepId, sleep.getTimeOffsetSleepRespiration());
//            }

            // 미사용 주석 처리 SLEEP_TIME_OFFSET_SPO2 테이블 INSERT
//            if (sleep.getTimeOffsetSleepSpo2() != null) {
//                addTimeSPO2(sleepId, sleep.getTimeOffsetSleepSpo2());
//            }
        }
    }

    public void addSleepLevelMap(int id, Map<String, List<SleepRequest.SleepLevelsMap>> sleepLevelsMap) {
        for ( String key : sleepLevelsMap.keySet()) {
            SleepRequest.SleepLevelsMap map = new SleepRequest.SleepLevelsMap();
            map.setId(id);
            map.setSleepType(key);
            for ( SleepRequest.SleepLevelsMap list : sleepLevelsMap.get(key) ) {
                map.setStartTimeInSeconds(list.getStartTimeInSeconds());
                map.setEndTimeInSeconds(list.getEndTimeInSeconds());

                sleepMapper.addSleepLevelMap(map);
            }
        }
    }
    public void addTimeRespiration(int id, Map<String,String> timeRespirationMap) {
        for ( String key : timeRespirationMap.keySet()) {
            SleepRequest.TimeOffsetSleepRespiration timeRespiration = new SleepRequest.TimeOffsetSleepRespiration();
            timeRespiration.setId(id);
            timeRespiration.setTimeOffsetSleepRespiration(timeRespirationMap.get(key));
            timeRespiration.setTimeOffsetSleepRespirationKey(key);

            sleepMapper.addTimeRespiration(timeRespiration);
        }
    }

    public void addTimeSPO2(int id, Map<String,String> timeSPO2Map) {
        for (String key : timeSPO2Map.keySet()) {
            SleepRequest.TimeOffsetSleepSpo2 timeSPO2 = new SleepRequest.TimeOffsetSleepSpo2();
            timeSPO2.setId(id);
            timeSPO2.setTimeOffsetSleepSPO2(timeSPO2Map.get(key));
            timeSPO2.setTimeOffsetSleepSPO2Key(key);

            sleepMapper.addTimeSPO2(timeSPO2);
        }
    }

    @Async
    @Transactional
    public void hcSleepSendAPI() {
        if (0 < sleepMapper.editSleepSendCodeFlag()) {
            List<Sleep> sleepList = sleepMapper.getHCSleep();

            for (Sleep sleep : sleepList) {
                HCSendAPIStatusCode statusCode = new HCSendAPIStatusCode();
                User user = userMapper.getTokenToUser(sleep.getUserAccessToken());
                // token으로 user table에서 loginId, deviceId 조회
                if (user == null || user.getLoginId() == null || "".equals(user.getLoginId())) {
                    statusCode.setId(sleep.getId());
                    statusCode.setCode("4");
                    sleepMapper.editSleepSendCode(statusCode);
                    logger.info("sleep user loginId error token : " + sleep.getUserAccessToken());
                    continue;
                }
                String loginId = user.getLoginId();
                String deviceId = user.getDeviceId();

                List<SleepLevels> SLList = sleepMapper.getHCSleepLevels(sleep.getId());

                // 헬스커넥트 요청 List
                List<Object> sleepTimeList = new ArrayList<Object>();
                for (SleepLevels sl : SLList) {
                    HashMap<String,Object> sleepMap = new HashMap<String,Object>();
                    int startTimestamp = sl.getStartTimeInSeconds();
                    int endTimestamp = sl.getEndTimeInSeconds();

                    sleepMap.put("resultStartDate", TimestampUtil.timestampToDate(startTimestamp, "yyyyMMdd"));
                    sleepMap.put("resultStartTime", TimestampUtil.timestampToDate(startTimestamp, "HHmm"));
                    sleepMap.put("resultEndDate", TimestampUtil.timestampToDate(endTimestamp, "yyyyMMdd"));
                    sleepMap.put("resultEndTime", TimestampUtil.timestampToDate(endTimestamp, "HHmm"));
                    sleepMap.put("sleepType", SleepType.getTypeToCode(sl.getSleepType()));
                    sleepMap.put("deviceId", deviceId);

                    sleepTimeList.add(sleepMap);
                }

                statusCode.setId(sleep.getId());
                statusCode.setCode(HCHttpClient.hcHttpClientPost(loginId, "sleepTimeList", hcSleepURL, sleepTimeList));

                sleepMapper.editSleepSendCode(statusCode);
            }
        }
    }
}
