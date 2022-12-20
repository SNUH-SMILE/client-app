package kr.uracle.smile.module.daily;

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
public class DailyService {

    @Value("${healthConnect.url.daily}")
    private String hcDailyURL;

    @Autowired
    private DailyMapper dailyMapper;

    @Autowired
    private UserMapper userMapper;

    /**
     * 심박수 등록
     */
    @Transactional
    public void addDaily(DailyRequest dailies) {
        for (DailyRequest.Dailies daily : dailies.getDailies() ) {
            dailyMapper.addDaily(daily);
            int dailyId = daily.getId();

            addTimeOffsetHeartRateSamples(dailyId, daily.getTimeOffsetHeartRateSamples());
        }
    }

    public void addTimeOffsetHeartRateSamples(int id, Map<String, Integer> timeOffsetHeartRateSample) {
        for ( String key : timeOffsetHeartRateSample.keySet() ) {
            DailyRequest.TimeOffsetHeartRateSamples map = new DailyRequest.TimeOffsetHeartRateSamples();
            map.setId(id);
            map.setTimeOffsetHeartRateKey(key);
            map.setTimeOffsetHeartRateValue(timeOffsetHeartRateSample.get(key));
            dailyMapper.addTimeOffsetHeartRateSamples(map);
        }
    }

    @Async
    @Transactional
    public void hcDailySendAPI() {
        if (0 < dailyMapper.editDailySendCodeFlag()) {
            List<Daily> dailyList = dailyMapper.getHCDaily();

            for (Daily daily : dailyList) {
                HCSendAPIStatusCode statusCode = new HCSendAPIStatusCode();
                User user = userMapper.getTokenToUser(daily.getUserAccessToken());
                // token으로 user table에서 loginId, deviceId 조회
                if (user == null || user.getLoginId() == null || "".equals(user.getLoginId())) {
                    statusCode.setId(daily.getId());
                    statusCode.setCode("4");
                    dailyMapper.editDailySendCode(statusCode);
                    logger.info("daily user loginId error token : " + daily.getUserAccessToken());
                    continue;
                }
                String loginId = user.getLoginId();
                String deviceId = user.getDeviceId();

                List<DailyHeartRate> HRList = dailyMapper.getHCDailyTimeOffsetHeartRate(daily.getId());

                // 헬스커넥트 요청 List
                List<Object> hrList = new ArrayList<Object>();
                for (DailyHeartRate hr : HRList) {
                    HashMap<String,Object> dailyMap = new HashMap<String,Object>();
                    int timestamp = daily.getStartTimeInSeconds() + Integer.valueOf(hr.getTimeOffsetHeartRateKey());

                    dailyMap.put("resultDate", TimestampUtil.timestampToDate(timestamp, "yyyyMMdd"));
                    dailyMap.put("resultTime", TimestampUtil.timestampToDate(timestamp, "HHmmss"));
                    dailyMap.put("hr", hr.getTimeOffsetHeartRateValue());
                    dailyMap.put("deviceId", deviceId);

                    hrList.add(dailyMap);
                }

                statusCode.setId(daily.getId());
                statusCode.setCode(HCHttpClient.hcHttpClientPost(loginId, "hrList", hcDailyURL, hrList));
                dailyMapper.editDailySendCode(statusCode);
            }
        }
    }
}
