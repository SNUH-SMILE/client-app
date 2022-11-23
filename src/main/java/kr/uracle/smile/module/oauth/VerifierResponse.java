package kr.uracle.smile.module.oauth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifierResponse {
    private String oauth_token;

    private String oauth_verifier;
}
