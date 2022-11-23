package kr.uracle.smile.module.oauth;

import kr.uracle.smile.module.oauth.OAuth10aConstants;
import kr.uracle.smile.module.oauth.AbstractOAuth10aCredentials;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
public class TemporaryCredentials extends AbstractOAuth10aCredentials {
    private String oauth_token_secret;

    private boolean oauth_callback_confirmed;

    public TemporaryCredentials(@NonNull String responseBody) {
        String[] elements = responseBody.split("&");
        for (String element : elements) {
            String[] kv = element.split("=");
            if (OAuth10aConstants.OAUTH_TOKEN.equals(kv[0].toLowerCase()))
                this.setOauth_token(kv[1]);
            if (OAuth10aConstants.OAUTH_TOKEN_SECRET.equals(kv[0].toLowerCase()))
                this.setOauth_token_secret(kv[1]);
            if (OAuth10aConstants.OAUTH_CALLBACK_CONFIRMED.equals(kv[0].toLowerCase()))
                this.setOauth_callback_confirmed(Boolean.valueOf(kv[1]));
        }
    }

    @Override
    public String toString() {
        return "TemporaryCredentials{" +
                "oauth_token_secret='" + oauth_token_secret + '\'' +
                ", oauth_callback_confirmed=" + oauth_callback_confirmed +
                ", oauth_token='" + oauth_token + '\'' +
                '}';
    }
}
