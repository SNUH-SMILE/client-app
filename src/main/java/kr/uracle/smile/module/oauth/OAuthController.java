package kr.uracle.smile.module.oauth;

import io.swagger.annotations.Api;
import kr.uracle.smile.module.Module;
import kr.uracle.smile.module.authentication.UserAuthenticationService;
import kr.uracle.smile.module.authentication.UserMapper;
import kr.uracle.smile.protocol.Response;
import kr.uracle.smile.protocol.ResponseCode;
import kr.uracle.smile.support.LocalizedString;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

@Controller
@RequestMapping("/oauth")
@Api(description = "테스트2", tags = "Test API")
@Slf4j
public class OAuthController extends Module {

    @Value("${oauth10a.consumer.key}")
    private String consumerKey;

    @Value("${oauth10a.consumer.secret}")
    private String consumerSecret;

    @Value("${oauth10a.provider.token.credentials.url}")
    private String tokenCredentialsUrl;

    @Value("${oauth10a.provider.temporary.credentials.url}")
    private String temporaryCredentialsUrl;

    @Value("${oauth10a.consumer.callback.url}")
    private String callbackUrl;

    @Value("${oauth10a.provider.authorize.url}")
    private String authorizeUrl;

    @Autowired
    private OAuthService oAuthService;

    @Autowired
    private UserAuthenticationService userService;

    @GetMapping("/login")
    public String getGarminLoginURL(@ModelAttribute @Valid OAuthLoginRequest loginRequest, HttpServletRequest request) {
        // 유효한 loginId가 요청올 경우 기존 token 삭제
        userService.dupLoginIdCheck(loginRequest.getLoginId());

        final AbstractOAuth10aRequestHeader tcHeader =
                new OAuth10aTemporaryCredentialRequestHeader(this.temporaryCredentialsUrl, this.consumerKey, this.consumerSecret, this.callbackUrl);

        final ResponseEntity<TemporaryCredentials> garminResponse =
                this.oAuthService.getTempCredentials(tcHeader, TemporaryCredentials.class);
        final TemporaryCredentials temporaryCredentials = garminResponse.getBody();

        HttpSession session = request.getSession();
        session.setAttribute("RTS", temporaryCredentials.getOauth_token_secret());
        session.setAttribute("loginId", loginRequest.getLoginId());
        session.setAttribute("deviceId", loginRequest.getDeviceId());

        return "redirect:" + this.authorizeUrl + "?"
                + OAuth10aConstants.OAUTH_TOKEN + "=" + temporaryCredentials.getOauth_token();
    }

    @GetMapping("/callback")
    public String oAuthCallback(HttpServletRequest request, VerifierResponse verifierResponse, Model model) {
        logger.info("OauthController requestTokenCredentials start");

        HttpSession session = request.getSession();
        final String requestTokenSecret = (String) session.getAttribute("RTS");
        final AbstractOAuth10aRequestHeader tcHeader =
                new OAuth10aTokenCredentialsRequestHeader(
                        this.tokenCredentialsUrl,
                        this.consumerKey,
                        this.consumerSecret,
                        verifierResponse.getOauth_token(),
                        requestTokenSecret,
                        verifierResponse.getOauth_verifier());

        final ResponseEntity<TokenCredentials> responseEntity =
                this.oAuthService.getCredentials(tcHeader, TokenCredentials.class);

        // User Table Insert
        int code = ResponseCode.ServerError.getCode();
        String message = getLocalizedString(LocalizedString.USER_INSERT_FAIL);

        if (responseEntity.getStatusCode().equals(HttpStatus.OK)) {
            int result = userService.addUser((String) session.getAttribute("loginId"), (String) session.getAttribute("deviceId"),
                    responseEntity.getBody().getOauth_token(), responseEntity.getBody().getOauth_token_secret());
            if (0 < result) {
                code = ResponseCode.Ok.getCode();
                message = getLocalizedString(LocalizedString.OK);
            }
        } else {
            message = getLocalizedString(LocalizedString.UNAUTHORIZED);
        }
        model.addAttribute("code", code);
        model.addAttribute("message", message);

        session.removeAttribute("RTS");
        session.removeAttribute("loginId");
        session.removeAttribute("deviceId");
        logger.info("OauthController requestTokenCredentials end");

        return "oauth/main";

    }

}
