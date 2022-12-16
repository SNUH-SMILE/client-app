package kr.uracle.smile.support.batch;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import kr.uracle.smile.module.authentication.User;
import kr.uracle.smile.module.authentication.UserMapper;
import kr.uracle.smile.module.common.HCHttpClient;
import kr.uracle.smile.module.common.HCSendAPIStatusCode;
import kr.uracle.smile.module.oauth.AbstractOAuth10aRequestHeader;
import kr.uracle.smile.module.oauth.DeregistrationRequestHeader;
import kr.uracle.smile.module.oauth.OAuthService;
import kr.uracle.smile.module.temperature.Temperature;
import kr.uracle.smile.module.temperature.TemperatureMapper;
import kr.uracle.smile.support.util.HttpClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Component
@Slf4j
public class ScheduledTasks {

    @Value("${oauth10a.consumer.key}")
    private String consumerKey;

    @Value("${oauth10a.consumer.secret}")
    private String consumerSecret;

    @Value("${deregistration.url}")
    private String deregistrationURL;

    @Value("${seers.login.url}")
    private String seersLoginURL;

    @Value("${seers.temperature.url}")
    private String temperatureURL;

    @Value("${healthConnect.url.bt}")
    private String hcBtURL;

    @Autowired
    private OAuthService oAuthService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private TemperatureMapper tempMapper;

    @Scheduled(cron = "0 0 2 * * *")
    private void batchDeleteToken() {
        logger.info("Expire Delete User Start");
        // db 조회 : 사용여부 Y, 만료일자가 지난 데이터
        List<User> userList = userMapper.getExpireTokenUser();

        // data가 있을 시 토큰 삭제 요청
        if (0 < userList.size()) {
            for (User user : userList) {
                // 가민에 토큰 삭제요청
                deleteToken(user);
            }
        }
        logger.info("Expire Delete User End : {} ", userList.size());
    }

    public void deleteToken(User user) {
        String code = "N";
        try {
            final AbstractOAuth10aRequestHeader tcHeader =
                    new DeregistrationRequestHeader(
                            this.deregistrationURL,
                            this.consumerKey,
                            this.consumerSecret,
                            user.getUserAccessToken(),
                            user.getUserAccessTokenSecret());

            final ResponseEntity<String> response = this.oAuthService.deregister(tcHeader);

            // User Table 에러일 경우 사용여부 E로 변경
            if (!response.getStatusCode().equals(HttpStatus.OK)) {
                code = "E";
            }
        } catch (Exception e){
            code = "E";
            e.printStackTrace();
        }
        logger.info("Expire Delete User : {}, code : {}", user, code);
        userMapper.editExpireUser(user.getId(), code);
    }

    /**
     * 체온 정보 요청
     */
    @Scheduled(cron = "0 */10 * * * *")
    public void batchTemperature() {
        logger.info("Temperature Start");
        LocalDateTime now = LocalDateTime.now();
        String startDateTime = now.minusMinutes(10).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:01"));
        String endDateTime = now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:00"));

        List<User> userList = userMapper.getAdditionUserCode();

        // 데이터 요청
        if (0 < userList.size()) {
            getTemperatures(userList, startDateTime, endDateTime);
        }

        // 헬스커넥스 요청
        hcTempSendAPI();

        logger.info("Temperature End AddCnt : {} 건", userList.size() );
    }

    public void getTemperatures(List<User> userList, String startDateTime, String endDateTime) {
        final String organizationCode = "KR_SNU";
        final String requestUserCode = "KR_SNU_snu_manager";
        final String id = "snu_manager";
        final String password = "a111111";
        final String route = "MANAGER_WEB";
        final String gmtCode = "GMT+0900";
        final String timezone = "Asia/Seoul";
        String accessToken = null;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        // 로그인 맵 생성
        HashMap<String, Object> loginMap = new HashMap<String, Object>();
        loginMap.put("id", id);
        loginMap.put("password", password);
        loginMap.put("route", route);
        loginMap.put("encryption", 0);
        loginMap.put("gmtCode", gmtCode);
        loginMap.put("timezone", timezone);
        loginMap.put("requestDateTime", startDateTime);
        loginMap.put("deviceKind", 3);

        try {
            String loginResult = HttpClient.executePost(seersLoginURL, true, loginMap, null);

            JsonObject obj = new Gson().fromJson(loginResult, JsonObject.class);
            String resultCode = obj.get("error").getAsString();
            if (resultCode != null && "0".equals(resultCode)) {
                accessToken = obj.get("accessToken").getAsString();
            }
        } catch (Exception e) {
            logger.info("seers login error : {}", e.getMessage());
        }

        // 조회 요청
        if (accessToken != null) {
            for (User user : userList) {
                HashMap<String, Object> temperatureMap = new HashMap<String, Object>();
                temperatureMap.put("organizationCode", organizationCode);
                temperatureMap.put("requestUserCode", requestUserCode);
                temperatureMap.put("additionalUserCode", user.getAdditionUserCode());
                temperatureMap.put("deviceKind", 3);
                temperatureMap.put("startDateTime", startDateTime);
                temperatureMap.put("endDateTime", endDateTime);
                temperatureMap.put("trendList", null);
                temperatureMap.put("order", "DESC");
                temperatureMap.put("gmtCode", gmtCode);
                temperatureMap.put("timezone", timezone);
                temperatureMap.put("requestDateTime", startDateTime);

                try {
                    String searchResult = HttpClient.executePost(temperatureURL, true, temperatureMap, accessToken);
                    JsonObject obj = new Gson().fromJson(searchResult, JsonObject.class);
                    logger.info("obj : {}", obj.toString());
                    JsonArray trendArray = obj.get("userTempLocationTrendList").getAsJsonArray();
                    for (int i=0; i < trendArray.size(); i++) {
                        JsonObject trendObj = trendArray.get(i).getAsJsonObject();
                        Temperature temp = new Temperature();
                        temp.setLoginId(user.getLoginId());
                        temp.setAdditionUserCode(user.getAdditionUserCode());
                        temp.setMeasurementDate(LocalDateTime.parse(trendObj.get("dateTime").getAsString(), formatter));
                        temp.setTemperature(trendObj.get("temperature").getAsFloat());
                        temp.setTrend(trendObj.get("trend").getAsInt());
                        temp.setEmergency(trendObj.get("emergency").getAsInt());
                        tempMapper.addTemperature(temp);
                    }
                } catch (Exception e) {
                    logger.info("temperature db insert fail : {} ", e.getMessage());
                }
            }
        }
    }

    public void hcTempSendAPI() {
        logger.info("hcTempSendAPI start");
        if (0 < tempMapper.editTempSendCodeFlag()) {
            List<Temperature> tempList = tempMapper.getHCTemp();
            logger.info("hcTempSendAPI temperatureList : {} ", tempList);

            for (Temperature temperature : tempList) {
                HCSendAPIStatusCode statusCode = new HCSendAPIStatusCode();
                User user = userMapper.getAdditionUserCodeToUser(temperature.getAdditionUserCode());
                // user table에서 loginId, deviceId 조회
                if (user == null || user.getLoginId() == null || "".equals(user.getLoginId())) {
                    statusCode.setId(temperature.getId());
                    statusCode.setCode("4");
                    tempMapper.editTempSendCode(statusCode);
                    logger.info("temperature user loginId error loginId : " + temperature.getLoginId());
                    continue;
                }

                String loginId = user.getLoginId();
                String deviceId = user.getDeviceId();

                List<Object> btList = new ArrayList<Object>();
                HashMap<String, Object> tempMap = new HashMap<String, Object>();
                tempMap.put("resultDate", temperature.getMeasurementDate().format(DateTimeFormatter.ofPattern("yyyyMMdd")));
                tempMap.put("resultTime", temperature.getMeasurementDate().format(DateTimeFormatter.ofPattern("HHmmss")));
                tempMap.put("bt", temperature.getTemperature());
                tempMap.put("deviceId", deviceId);

                btList.add(tempMap);

                HashMap<String, Object> params = new HashMap<String, Object>();
                params.put("loginId", loginId);
                params.put("btList", btList);

                statusCode.setId(temperature.getId());
                statusCode.setCode(HCHttpClient.hcHttpClientPost(loginId, "btList", hcBtURL, btList));
                tempMapper.editTempSendCode(statusCode);
            }
        }
        logger.info("hcTempSendAPI end");
    }
}
