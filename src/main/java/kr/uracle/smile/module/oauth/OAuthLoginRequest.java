package kr.uracle.smile.module.oauth;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
public class OAuthLoginRequest {

    @NotNull
    private String loginId;

    @NotNull
    private String deviceId;
}
