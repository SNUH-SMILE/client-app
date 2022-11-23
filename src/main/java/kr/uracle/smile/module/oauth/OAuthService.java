package kr.uracle.smile.module.oauth;

import kr.uracle.smile.module.exception.OAuth10aException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.lang.reflect.InvocationTargetException;

@Service
@Slf4j
public class OAuthService {

    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private OAuth10aSignatureSupport oAuth10ASignatureSupport;

    public <T extends AbstractOAuth10aCredentials> ResponseEntity<T> getTempCredentials(AbstractOAuth10aRequestHeader oAuthRequestHeader, Class<T> clazz) {
        this.oAuth10ASignatureSupport.fillNonce(oAuthRequestHeader);
        this.oAuth10ASignatureSupport.requestTokenSignature(oAuthRequestHeader);
        final HttpHeaders httpHeaders = new HttpHeaders();
        logger.info("oAuthRequestHeader : {} ", oAuthRequestHeader.getRequestHeader());
        httpHeaders.add(OAuth10aConstants.AUTHORIZATION, oAuthRequestHeader.getRequestHeader());
        final HttpEntity<String> reqEntity = new HttpEntity<>(httpHeaders);

        final ResponseEntity<String> response = this.restTemplate.exchange(
                oAuthRequestHeader.getServerUrl(),
                HttpMethod.POST,
                reqEntity,
                String.class
        );

        if (response.getStatusCode().equals(HttpStatus.OK)) {

            AbstractOAuth10aCredentials oAuthCredentials;
            try {
                oAuthCredentials = clazz.getConstructor(String.class).newInstance(response.getBody());
            } catch (Exception e) {
                throw new RuntimeException(e);
            }

            return new ResponseEntity<>((T) oAuthCredentials, HttpStatus.OK);
        } else {
            throw new OAuth10aException("Response from Server: " + response.getStatusCode() + " " + response.getBody());
        }
    }

    public <T extends AbstractOAuth10aCredentials> ResponseEntity<T> getCredentials(AbstractOAuth10aRequestHeader oAuthRequestHeader, Class<T> clazz) {

        this.oAuth10ASignatureSupport.fillNonce(oAuthRequestHeader);
        this.oAuth10ASignatureSupport.accessTokenSignature(oAuthRequestHeader);
        final HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(OAuth10aConstants.AUTHORIZATION, oAuthRequestHeader.getRequestHeader());
        final HttpEntity<String> reqEntity = new HttpEntity<>(httpHeaders);

        final ResponseEntity<String> response = this.restTemplate.exchange(
                oAuthRequestHeader.getServerUrl(),
                HttpMethod.POST,
                reqEntity,
                String.class
        );

        if (response.getStatusCode().equals(HttpStatus.OK)) {
            AbstractOAuth10aCredentials oAuthCredentials;
            try {
                oAuthCredentials = clazz.getConstructor(String.class).newInstance(response.getBody());
            } catch (Exception e) {
                throw new OAuth10aException("oAuthCredentials Error : " + e.getMessage());
            }
            return new ResponseEntity<>((T) oAuthCredentials, HttpStatus.OK);
        } else {
            return new ResponseEntity<>((T) null, HttpStatus.UNAUTHORIZED);
        }
    }

    public ResponseEntity<String> deregister(AbstractOAuth10aRequestHeader oAuthRequestHeader) {

        this.oAuth10ASignatureSupport.fillNonce(oAuthRequestHeader);
        this.oAuth10ASignatureSupport.accessTokenSignature(oAuthRequestHeader);
        final HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(OAuth10aConstants.AUTHORIZATION, oAuthRequestHeader.getRequestBackFillHeader());
        logger.info("### Deregistration request header: {}", oAuthRequestHeader.getRequestBackFillHeader());
        final HttpEntity<String> reqEntity = new HttpEntity<>(httpHeaders);

        final ResponseEntity<String> response = this.restTemplate.exchange(
                oAuthRequestHeader.getServerUrl(),
                HttpMethod.DELETE,
                reqEntity,
                String.class
        );

        if (response.getStatusCode().equals(HttpStatus.NO_CONTENT)) {
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            throw new OAuth10aException("Response from Server: " + response.getStatusCode() + " " + response.getBody());
        }
    }
}
