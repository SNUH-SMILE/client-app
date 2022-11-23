package kr.uracle.smile.module.oauth;

import kr.uracle.smile.module.oauth.OAuth10aConstants;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpMethod;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import static kr.uracle.smile.support.util.EncodingUtils.getPercentEncoded;
@Getter
@Setter
public class OAuth10aTemporaryCredentialRequestHeader extends AbstractOAuth10aRequestHeader {

    private String oauthCallbackUrl;

    private String oauthVersion = OAuth10aConstants.OAUTH_VERSION_1_0;

    public OAuth10aTemporaryCredentialRequestHeader(String serverUrl,
                                                    String oauthConsumerKey,
                                                    String oauthConsumerSecret,
                                                    String oauthCallbackUrl) {
        URI uri = URI.create(serverUrl);
        this.httpMethod = HttpMethod.POST.toString();
        this.serverUrl = serverUrl;
        this.scheme = uri.getScheme();
        this.serverName = uri.getHost();
        this.serverPort = uri.getPort() == -1
                ? ("http".equals(this.scheme) ? 80 : "https".equals(this.scheme) ? 443 : -1)
                : uri.getPort();
        this.queryString = uri.getQuery();
        this.contentType = null;  // no need for temporary credentials
        this.requestBody = null;  // no need for temporary credentials
        this.oauthConsumerKey = oauthConsumerKey;
        this.oauthConsumerSecret = oauthConsumerSecret;
        this.oauthCallbackUrl = oauthCallbackUrl;
        this.oauthTimestamp = String.valueOf(System.currentTimeMillis() / 1000);
    }

    public String getRequestHeader() {
        final StringBuilder sb = new StringBuilder();
        sb.append("OAuth ")
                .append(OAuth10aConstants.OAUTH_CONSUMER_KEY).append("=\"").append(this.oauthConsumerKey).append("\", ")
                .append(OAuth10aConstants.OAUTH_SIGNATURE_METHOD).append("=\"").append(this.oauthSignatureMethod).append("\", ")
                .append(OAuth10aConstants.OAUTH_TIMESTAMP).append("=\"").append(this.oauthTimestamp).append("\", ")
                .append(OAuth10aConstants.OAUTH_NONCE).append("=\"").append(this.oauthNonce).append("\", ")
                .append(OAuth10aConstants.OAUTH_VERSION).append("=\"").append(this.oauthVersion).append("\", ")
                .append(OAuth10aConstants.OAUTH_CALLBACK).append("=\"").append(getPercentEncoded(this.oauthCallbackUrl)).append("\", ")
                .append(OAuth10aConstants.OAUTH_SIGNATURE).append("=\"").append(getPercentEncoded(this.oauthSignature)).append("\"");
        return sb.toString();
    }

    @Override
    public String getRequestBackFillHeader() {
        return null;
    }

    @Override
    public String getKey() {
        return getPercentEncoded(this.getOauthConsumerSecret()) + "&";
    }

    @Override
    public Map<String, String> getRequestHeaderMap() {
        final HashMap<String, String> headerMap = new HashMap<>();

        headerMap.put(OAuth10aConstants.OAUTH_CONSUMER_KEY, this.getOauthConsumerKey());
        headerMap.put(OAuth10aConstants.OAUTH_SIGNATURE_METHOD, this.getOauthSignatureMethod());
        headerMap.put(OAuth10aConstants.OAUTH_TIMESTAMP, this.getOauthTimestamp());
        headerMap.put(OAuth10aConstants.OAUTH_NONCE, this.getOauthNonce());
        headerMap.put(OAuth10aConstants.OAUTH_VERSION, this.getOauthVersion());
        headerMap.put(OAuth10aConstants.OAUTH_CALLBACK, this.getOauthCallbackUrl());

        return headerMap;
    }
}
