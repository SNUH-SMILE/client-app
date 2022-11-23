package kr.uracle.smile.module.oauth;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class TokenCredentials extends AbstractOAuth10aCredentials {

    private String oauth_token_secret;

    public TokenCredentials(@NonNull String responseBody) {
        String[] elements = responseBody.split("&");
        for (String element : elements) {
            String[] kv = element.split("=");
            if (OAuth10aConstants.OAUTH_TOKEN.equals(kv[0].toLowerCase()))
                this.setOauth_token(kv[1]);
            if (OAuth10aConstants.OAUTH_TOKEN_SECRET.equals(kv[0].toLowerCase()))
                this.setOauth_token_secret(kv[1]);
        }
    }
}
