package kr.uracle.smile.module.common;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import kr.uracle.smile.support.util.HttpClient;
import lombok.extern.slf4j.Slf4j;
import java.util.HashMap;
import java.util.List;

@Slf4j
public class HCHttpClient {

    public static String hcHttpClientPost(String loginId, String listName, String URL, List<Object> list) {
        HashMap<String, Object> params = new HashMap<String, Object>();
        params.put("loginId", loginId);
        params.put(listName, list);

        logger.info("SendAPI loginId : {}, api : {}", loginId, listName);

        return executePost(URL, params);
    }

    public static String hcHttpClientPost(String loginId, String listName, String URL, String sleepListKey, String deleteSleepListKey, List<Object> list) {
        HashMap<String, Object> params = new HashMap<String, Object>();
        params.put("loginId", loginId);
        params.put("sleepListKey", sleepListKey);
        params.put("deleteSleepListKey", deleteSleepListKey);
        params.put(listName, list);

        logger.info("SendAPI loginId : {}, api : {}, sleepListKey : {}, deleteSleepListKey : {} ", loginId, listName, sleepListKey, deleteSleepListKey);

        return executePost(URL, params);
    }

    public static String executePost(String URL, HashMap<String, Object> params) {
        String resultCode = "2";
        try {
            String httpResult = HttpClient.executePost(URL, true, params, null);
            JsonObject obj = new Gson().fromJson(httpResult, JsonObject.class);
            String code = obj.get("code").getAsString();
            if (code != null && !"00".equals(code)) {
                logger.info("URL : {} API call fail : {} ", URL , code);
                resultCode = "4";
            }
        } catch (Exception e) {
            resultCode = "3";
            logger.info("URL : {} API call error : {} ", URL , e.getMessage());
        }
        return resultCode;
    }
}
