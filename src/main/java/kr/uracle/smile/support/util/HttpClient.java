package kr.uracle.smile.support.util;

import com.google.gson.Gson;
import kr.uracle.smile.module.exception.UnprocessableRequestException;
import kr.uracle.smile.support.LocalizedString;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.NameValuePair;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.springframework.http.HttpStatus;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
public class HttpClient {

    public static String executePost(String url, boolean bjson, HashMap<String, Object> params) throws Exception {
        RequestConfig requestConfig = RequestConfig.custom()
                .setSocketTimeout(30*1000)
                .setConnectTimeout(30*1000)
                .setConnectionRequestTimeout(30*1000)
                .build();

        HttpPost httpPost = new HttpPost(url);
        httpPost.setConfig(requestConfig);


        if (bjson) {
            httpPost.addHeader("content-type", "application/json");
            httpPost.setEntity(new StringEntity(new Gson().toJson(params), ContentType.APPLICATION_JSON));
        } else {
            List<NameValuePair> nvp = new ArrayList<NameValuePair>();
            for (Map.Entry<String, Object> entry : params.entrySet()) {
                nvp.add(new BasicNameValuePair(entry.getKey(), entry.getValue().toString()));
            }
            httpPost.setEntity(new UrlEncodedFormEntity(nvp));
        }

        return execute(httpPost);
    }

    private static String execute(HttpUriRequest request) throws Exception {
        CloseableHttpClient httpClient = HttpClients.createDefault();

        try {
            CloseableHttpResponse httpResponse = httpClient.execute(request);
            HttpStatus httpStatus = HttpStatus.valueOf(httpResponse.getStatusLine().getStatusCode());

            if (!httpStatus.is2xxSuccessful()) {
                throw new UnprocessableRequestException(LocalizedString.HEALTH_CONNECT_FAIL
                        + request.getMethod() + " " + request.getURI().toString() + " - " + httpStatus.getReasonPhrase());
            }

            return EntityUtils.toString(httpResponse.getEntity(), "UTF-8");

        } catch(Exception e) {
            throw new UnprocessableRequestException(e.getMessage(), e);
        } finally {
            httpClient.close();
        }
    }

}
