package kr.uracle.smile.module.backfill;

import kr.uracle.smile.module.authentication.User;
import kr.uracle.smile.module.authentication.UserMapper;
import kr.uracle.smile.module.oauth.AbstractOAuth10aRequestHeader;
import kr.uracle.smile.module.oauth.OAuth10aConstants;
import kr.uracle.smile.module.oauth.OAuth10aSignatureSupport;
import kr.uracle.smile.module.exception.OAuth10aException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class BackfillService {

    @Value("${oauth10a.consumer.key}")
    private String consumerKey;

    @Value("${oauth10a.consumer.secret}")
    private String consumerSecret;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private OAuth10aSignatureSupport oAuth10ASignatureSupport;

    @Autowired
    private UserMapper userMapper;

    public ResponseEntity<String> getBackfill(String backfillURL, Backfill backfill) {
        try {
            // token으로 user table에서 loginId, deviceId 조회
            User user = userMapper.getLoginIdToUser(backfill.getLoginId());
            if (user == null || user.getUserAccessToken() == null || "".equals(user.getUserAccessToken())) {
                logger.info("User 정보가 존재하지 않습니다. : {} " + backfill.getLoginId());
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            String token = user.getUserAccessToken();
            String tokenSecret = user.getUserAccessTokenSecret();

            if( token == null || "".equals(token) ) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            final AbstractOAuth10aRequestHeader tcHeader =
                    new BackfillRequestHeader(
                            backfillURL,
                            this.consumerKey,
                            this.consumerSecret,
                            token,
                            tokenSecret,
                            "",
                            backfill.getSummaryStartTime(),
                            backfill.getSummaryEndTime());

            return requestBackfill(tcHeader);
        } catch (Exception e) {
            logger.info("getBackfill error : {} ", e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

    }

    public ResponseEntity<String> requestBackfill(AbstractOAuth10aRequestHeader oAuthRequestHeader) {
        this.oAuth10ASignatureSupport.fillNonce(oAuthRequestHeader);
        this.oAuth10ASignatureSupport.accessTokenSignature(oAuthRequestHeader);
        final HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(OAuth10aConstants.AUTHORIZATION, oAuthRequestHeader.getRequestBackFillHeader());

        final HttpEntity<String> reqEntity = new HttpEntity<>(httpHeaders);

        final ResponseEntity<String> response = this.restTemplate.exchange(
                oAuthRequestHeader.getServerUrl() + "?summaryStartTimeInSeconds=" +oAuthRequestHeader.getSummaryStartTimeInSeconds()
                        +"&summaryEndTimeInSeconds=" + oAuthRequestHeader.getSummaryEndTimeInSeconds(),
                HttpMethod.GET,
                reqEntity,
                String.class
        );
        logger.info("requestBackfill response : {}", response);

        if (response.getStatusCode().equals(HttpStatus.ACCEPTED)) {
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            logger.info("requestBackfill error : " + response.getStatusCode() + " || " + response.getBody());
            throw new OAuth10aException("Response from Server: " + response.getStatusCode() + " " + response.getBody());
        }
    }

}
