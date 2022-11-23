package kr.uracle.smile.module.respiration;

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
public class RespirationService {

    @Value("${healthConnect.url.respiration}")
    private String hcRespirationURL;

    @Autowired
    private RespirationMapper respirationMapper;

    @Autowired
    private UserMapper userMapper;

    @Transactional
    public void addRespiration(RespirationRequest respirationRequest) {
        for (RespirationRequest.Respirations res : respirationRequest.getAllDayRespiration()) {
            respirationMapper.addRespiration(res);
            int resId = res.getId();
            addTimeOffsetEpochToBreaths(resId, res.getTimeOffsetEpochToBreaths());
        }
    }

    public void addTimeOffsetEpochToBreaths(int id, Map<String, Double> breaths) {
        for (String key : breaths.keySet()) {
            RespirationRequest.TimeOffsetEpochToBreaths toetb = new RespirationRequest.TimeOffsetEpochToBreaths();
            toetb.setId(id);
            toetb.setTimeOffsetEpochToBreathsKey(key);
            toetb.setTimeOffsetEpochToBreathsValue(breaths.get(key));

            respirationMapper.addTimeOffsetEpochToBreaths(toetb);
        }
    }

    @Async
    @Transactional
    public void hcRespirationSendAPI() {
        if (0 < respirationMapper.editRespirationSendCodeFlag()) {
            List<Respiration> respirationList = respirationMapper.getHCRespiration();

            for (Respiration respiration : respirationList) {
                HCSendAPIStatusCode statusCode = new HCSendAPIStatusCode();
                User user = userMapper.getTokenToUser(respiration.getUserAccessToken());
                // token으로 user table에서 loginId, deviceId 조회
                if (user == null || user.getLoginId() == null || "".equals(user.getLoginId())) {
                    statusCode.setId(respiration.getId());
                    statusCode.setCode("4");
                    respirationMapper.editRespirationSendCode(statusCode);
                    logger.info("respiration user loginId error token : " + respiration.getUserAccessToken());
                    continue;
                }
                String loginId = user.getLoginId();
                String deviceId = user.getDeviceId();

                List<RespirationBreaths> RBList = respirationMapper.getHCRespirationBreaths(respiration.getId());
                // 헬스커넥트 요청 List
                List<Object> rrList = new ArrayList<Object>();
                for (RespirationBreaths rb : RBList) {
                    HashMap<String,Object> rbMap = new HashMap<String,Object>();
                    int timestamp = respiration.getStartTimeInSeconds() + Integer.valueOf(rb.getTimeOffsetEpochToBreathsKey());

                    rbMap.put("resultDate", TimestampUtil.timestampToDate(timestamp, "yyyyMMdd"));
                    rbMap.put("resultTime", TimestampUtil.timestampToDate(timestamp, "HHmmss"));
                    rbMap.put("rr", rb.getTimeOffsetEpochToBreathsValue());
                    rbMap.put("deviceId", deviceId);

                    rrList.add(rbMap);
                }

                statusCode.setId(respiration.getId());
                statusCode.setCode(HCHttpClient.hcHttpClientPost(loginId, "rrList", hcRespirationURL, rrList));
                respirationMapper.editRespirationSendCode(statusCode);
            }
        }
    }
}
