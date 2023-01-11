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
        String resultCode = "2";

        HashMap<String, Object> params = new HashMap<String, Object>();
        params.put("loginId", loginId);
        params.put(listName, list);

        logger.info("SendAPI loginId : {}, api : {}, params : {}", loginId, listName, params);

        try {
            String httpResult = HttpClient.executePost(URL, true, params, null);
            logger.info("httpResult : {}", httpResult);
            JsonObject obj = new Gson().fromJson(httpResult, JsonObject.class);
            String code = obj.get("code").getAsString();
            if (code != null && !"00".equals(code)) {
                resultCode = "4";
            }
        } catch (Exception e) {
            resultCode = "3";
            logger.info("URL : {} API call error : {} ", URL , e.getMessage());
        }

        return resultCode;
    }
}
