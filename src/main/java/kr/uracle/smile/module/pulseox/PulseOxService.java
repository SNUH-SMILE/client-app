package kr.uracle.smile.module.pulseox;

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
public class PulseOxService {

    @Value("${healthConnect.url.pulseOx}")
    private String hcPulseOxURL;

    @Autowired
    private PulseOxMapper pulseOxMapper;

    @Autowired
    private UserMapper userMapper;

    @Transactional
    public void addPulseOx(PulseOxRequest pulseOxRequest) {
        for (PulseOxRequest.PulseOxs pulseOxs : pulseOxRequest.getPulseox()) {
            pulseOxMapper.addPulseOx(pulseOxs);

            int pulseOxId = pulseOxs.getId();
            for ( String key : pulseOxs.getTimeOffsetSpo2Values().keySet()) {
                PulseOxRequest.PulseOxTimeOffsetSpo2Values pulseOxTimeValue = new PulseOxRequest.PulseOxTimeOffsetSpo2Values();
                pulseOxTimeValue.setId(pulseOxId);
                pulseOxTimeValue.setTimeOffsetSpo2Values(pulseOxs.getTimeOffsetSpo2Values().get(key));
                pulseOxTimeValue.setTimeOffsetSpo2ValuesKey(key);

                pulseOxMapper.addPulseOxTimeOffsetValue(pulseOxTimeValue);
            }
        }
    }

    /**
     * PULSE_OX(산소포화도) 데이터 조회하여 헬스커넥트에 전달
     *
     */
    @Async
    @Transactional
    public void hcPulseOxSendAPI() {
        if (0 < pulseOxMapper.editPulseOxSendCodeFlag()) {
            List<PulseOx> pulseOxList = pulseOxMapper.getHCPulseOx();

            for (PulseOx pulseOx : pulseOxList) {
                HCSendAPIStatusCode statusCode = new HCSendAPIStatusCode();
                User user = userMapper.getTokenToUser(pulseOx.getUserAccessToken());
                // token으로 user table에서 loginId, deviceId 조회
                if (user == null || user.getLoginId() == null || "".equals(user.getLoginId())) {
                    statusCode.setId(pulseOx.getId());
                    statusCode.setCode("4");
                    pulseOxMapper.editPulseOxSendCode(statusCode);
                    logger.info("pulseOx user loginId error token : " + pulseOx.getUserAccessToken());
                    continue;
                }
                String loginId = user.getLoginId();
                String deviceId = user.getDeviceId();

                List<PulseOxTimeOffsetSpo2Values> pulseOxTOSVList = pulseOxMapper.getHCPulseOxTimeOffsetSpo2Values(pulseOx.getId());

                // 헬스커넥트 요청 List
                List<Object> spO2List = new ArrayList<Object>();
                for (PulseOxTimeOffsetSpo2Values pulseOxTOSV : pulseOxTOSVList) {
                    HashMap<String,Object> pulseOxMap = new HashMap<String,Object>();
                    int timestamp = pulseOx.getStartTimeInSeconds() + Integer.valueOf(pulseOxTOSV.getTimeOffsetSpo2ValuesKey());

                    pulseOxMap.put("resultDate", TimestampUtil.timestampToDate(timestamp, "yyyyMMdd"));
                    pulseOxMap.put("resultTime", TimestampUtil.timestampToDate(timestamp, "HHmmss"));
                    pulseOxMap.put("spO2", pulseOxTOSV.getTimeOffsetSpo2Values());
                    pulseOxMap.put("deviceId", deviceId);

                    spO2List.add(pulseOxMap);
                }

                statusCode.setId(pulseOx.getId());
                statusCode.setCode(HCHttpClient.hcHttpClientPost(loginId, "spO2List", hcPulseOxURL, spO2List));
                pulseOxMapper.editPulseOxSendCode(statusCode);
            }
        }
    }

}