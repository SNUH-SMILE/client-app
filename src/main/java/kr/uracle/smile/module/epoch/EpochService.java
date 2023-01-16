package kr.uracle.smile.module.epoch;

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

@Service
@Slf4j
public class EpochService {

    @Value("${healthConnect.url.step}")
    private String hcStepURL;

    @Autowired
    private EpochMapper epochMapper;

    @Autowired
    private UserMapper userMapper;

    @Transactional
    public void addEpoch(EpochRequest epochRequest) {
        for (EpochRequest.Epochs epochs : epochRequest.getEpochs()) {
            epochMapper.addEpoch(epochs);
        }
    }

    /**
     * EPOCH(걸음수) 데이터 조회하여 헬스커넥트에 전달
     *
     */
    @Async
    @Transactional
    public void hcEpochSendAPI() {
        // 결과 전달 데이터 update 0: 대기, 1: 요청중, 2: 완료 , 0, 3 -> 1 update
        if (0 < epochMapper.editEpochSendCodeFlag()) {
            // code : 1 select
            List<Epoch> epochsList = epochMapper.getHCEpoch();

            for (Epoch epoch : epochsList) {
                HCSendAPIStatusCode statusCode = new HCSendAPIStatusCode();
                User user = userMapper.getTokenToUser(epoch.getUserAccessToken());
                // token으로 user table에서 loginId, deviceId 조회
                if (user == null || user.getLoginId() == null || "".equals(user.getLoginId())) {
                    statusCode.setId(epoch.getId());
                    statusCode.setCode("4");
                    epochMapper.editEpochSendCode(statusCode);
                    logger.info("epoch user loginId error token : " + epoch.getUserAccessToken());
                    continue;
                }
                String loginId = user.getLoginId();
                String deviceId = user.getDeviceId();
                int timestamp = epoch.getStartTimeInSeconds();

                // 헬스커넥트 요청 List
                List<Object> stepCountList = new ArrayList<Object>();
                HashMap<String, Object> stepMap = new HashMap<String, Object>();
                stepMap.put("resultDate", TimestampUtil.timestampToDate(timestamp, "yyyyMMdd"));
                stepMap.put("resultTime", TimestampUtil.timestampToDate(timestamp, "HHmmss"));
                stepMap.put("stepCount", epoch.getSteps());
                stepMap.put("distance", epoch.getDistanceInMeters());
                stepMap.put("deviceId", deviceId);

                stepCountList.add(stepMap);

                HashMap<String, Object> params = new HashMap<String, Object>();
                params.put("loginId", loginId);
                params.put("stepCountList", stepCountList);

                statusCode.setId(epoch.getId());
                statusCode.setCode(HCHttpClient.hcHttpClientPost(loginId, "stepCountList", hcStepURL, stepCountList));
                epochMapper.editEpochSendCode(statusCode);
            }
        }
    }
}