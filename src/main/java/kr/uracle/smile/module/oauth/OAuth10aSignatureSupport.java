package kr.uracle.smile.module.oauth;

import org.springframework.stereotype.Component;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import static kr.uracle.smile.support.util.EncodingUtils.getPercentEncoded;
import static kr.uracle.smile.support.util.EncodingUtils.getPercentDecoded;

@Component
public class OAuth10aSignatureSupport {

    /**
     * @see <a href="https://tools.ietf.org/html/rfc5849#section-3.3">Spec 3.3. Nonce and Timestamp</a>
     * @param header
     */
    public void fillNonce(AbstractOAuth10aRequestHeader header) {
        header.setOauthNonce(Base64.getEncoder()
                .encodeToString(String.valueOf(UUID.randomUUID()).getBytes()));
    }

    /**
     * @see <a href="https://tools.ietf.org/html/rfc5849#section-3.3">Spec 3.4. Signature</a>
     * @param header
     */
    public void requestTokenSignature(AbstractOAuth10aRequestHeader header) {

        //Consumer Secret and Request Token Secret
        String key = header.getKey();

        String baseString = generateBaseString(header);

        try {
            final SecretKeySpec signingKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), OAuth10aConstants.HMAC_SHA1_ALGORITHM_NAME);
            final Mac mac = Mac.getInstance(OAuth10aConstants.HMAC_SHA1_ALGORITHM_NAME);
            mac.init(signingKey);
            final String signature = Base64.getEncoder().encodeToString(mac.doFinal((baseString).getBytes(StandardCharsets.UTF_8)));
            header.setOauthSignature(signature);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        } catch (InvalidKeyException e) {
            throw new RuntimeException(e);
        }
    }

    public void accessTokenSignature(AbstractOAuth10aRequestHeader header) {

        //Consumer Secret and Request Token Secret
        String key = header.getKey();

        String baseString = generateBaseString2(header);

        try {
            final SecretKeySpec signingKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), OAuth10aConstants.HMAC_SHA1_ALGORITHM_NAME);
            final Mac mac = Mac.getInstance(OAuth10aConstants.HMAC_SHA1_ALGORITHM_NAME);
            mac.init(signingKey);
            final String signature = Base64.getEncoder().encodeToString(mac.doFinal((baseString).getBytes(StandardCharsets.UTF_8)));
            header.setOauthSignature(signature);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        } catch (InvalidKeyException e) {
            throw new RuntimeException(e);
        }
    }


    /**
     * @see <a href="https://tools.ietf.org/html/rfc5849#section-3.4.1">Spec 3.4.1. Signature Base String</a>
     * @param header
     * @return
     */
    private String generateBaseString2(AbstractOAuth10aRequestHeader header) {


        header.setOauthToken(header.getOauthToken());
        header.setOauthVerifier(header.getOauthVerifier());

        String httpMethod = header.getHttpMethod();
        String baseUri = getBaseStringUri(header);
        String requestParameters = getRequestParameters(header);

        final StringBuilder sb = new StringBuilder();
        sb.append(httpMethod)
                .append('&').append(getPercentEncoded(baseUri))
                .append('&').append(getPercentEncoded(requestParameters));

        return sb.toString();
    }

    private String generateBaseString(AbstractOAuth10aRequestHeader header) {

        String httpMethod = header.getHttpMethod();
        String baseUri = getBaseStringUri(header);
        String requestParameters = getRequestParameters(header);

        final StringBuilder sb = new StringBuilder();
        sb.append(httpMethod)
                .append('&').append(getPercentEncoded(baseUri))
                .append('&').append(getPercentEncoded(requestParameters));

        return sb.toString();
    }


    /**
     * @see <a href="https://tools.ietf.org/html/rfc5849#section-3.4.1.2">Spec 3.4.1.2. Base String URI</a>
     * @param header
     * @return
     */
    private String getBaseStringUri(AbstractOAuth10aRequestHeader header) {
        final String serverUrl = header.getServerUrl();
        final int qIndex = serverUrl.indexOf('?');
        return qIndex > 0 ? serverUrl.substring(0, qIndex) : serverUrl;
    }

    /**
     * @see <a href="https://tools.ietf.org/html/rfc5849#section-3.4.1.3">Spec 3.4.1.3. Request Parameters</a>
     * @param header
     * @return
     */
    private String getRequestParameters(AbstractOAuth10aRequestHeader header) {
        return getNormalizedParameters(getParameterSources(header));
    }

    /**
     * @see <a href="https://tools.ietf.org/html/rfc5849#section-3.4.1.3.1">Spec 3.4.1.3.1. Parameter Sources</a>
     * @param header
     * @return
     */
    private Map<String, List<String>> getParameterSources(AbstractOAuth10aRequestHeader header) {
        final Map<String, List<String>> paramSources = new HashMap<>();

        final String queryString = header.getQueryString();
        kvToMultiValueMap(paramSources, queryString);

        final Map<String, String> requestHeaderMap = header.getRequestHeaderMap();

        for (Map.Entry<String, String> entry: requestHeaderMap.entrySet()) {
            putMultiValue(paramSources, entry.getKey(), entry.getValue());
        }

        final String requestBody = header.getRequestBody();
        kvToMultiValueMap(paramSources, requestBody);

        return paramSources;
    }

    private void kvToMultiValueMap(Map<String, List<String>> paramSources, String kvPairs) {
        if (kvPairs != null && !kvPairs.isEmpty()) {
            String[] params = kvPairs.split("&");
            for (String param : params) {
                String[] kv = param.split("=");
                String key = getPercentDecoded(kv[0]);
                String value = kv.length == 2 ? getPercentDecoded(kv[1]) : "";
                putMultiValue(paramSources, key, value);
            }
        }
    }

    private void putMultiValue(Map<String, List<String>> map, String key, String value) {
        if (map.get(key) == null) {
            final ArrayList<String> values = new ArrayList<>();
            values.add(value);
            map.put(key, values);
        } else {
            map.get(key).add(value);
        }
    }

    /**
     * @see <a href="https://tools.ietf.org/html/rfc5849#section-3.4.1.3.2">Spec 3.4.1.3.2. Parameters Normalization</a>
     * @param parameterSources
     * @return
     */
    private String getNormalizedParameters(Map<String, List<String>> parameterSources) {
        SortedMap<String, List<String>> normalizedParametersMap = new TreeMap<>();
        final Set<Map.Entry<String, List<String>>> entries = parameterSources.entrySet();
        for (Map.Entry<String, List<String>> entry: entries) {
            for (String value: entry.getValue()) {
                putMultiValue(normalizedParametersMap, getPercentEncoded(entry.getKey()), getPercentEncoded(value));
            }
            List<String> values = normalizedParametersMap.get(getPercentEncoded(entry.getKey()));
            Collections.sort(values);
        }

        final Set<Map.Entry<String, List<String>>> normalizedEntries = normalizedParametersMap.entrySet();
        final StringBuilder sb = new StringBuilder();
        for (Map.Entry<String, List<String>> entry: normalizedEntries) {
            for (String value: entry.getValue()) {
                sb.append('&')
                        .append(entry.getKey()).append('=').append(value);
            }
        }
        return sb.toString().substring(1);
    }

}
