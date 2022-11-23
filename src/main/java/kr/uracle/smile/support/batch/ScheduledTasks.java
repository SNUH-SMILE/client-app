package kr.uracle.smile.support.batch;

import kr.uracle.smile.module.authentication.User;
import kr.uracle.smile.module.authentication.UserMapper;
import kr.uracle.smile.module.oauth.AbstractOAuth10aRequestHeader;
import kr.uracle.smile.module.oauth.DeregistrationRequestHeader;
import kr.uracle.smile.module.oauth.OAuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
public class ScheduledTasks {

    @Value("${oauth10a.consumer.key}")
    private String consumerKey;

    @Value("${oauth10a.consumer.secret}")
    private String consumerSecret;

    @Value("${deregistration.url}")
    private String deregistrationURL;

    @Autowired
    private OAuthService oAuthService;

    @Autowired
    private UserMapper userMapper;

    @Scheduled(cron = "0 0 2 * * *")
    private void batchDeleteToken() {
        logger.info("Expire Delete User Start");
        // db 조회 : 사용여부 Y, 만료일자가 지난 데이터
        List<User> userList = userMapper.getExpireTokenUser();

        // data가 있을 시 토큰 삭제 요청
        if (0 < userList.size()) {
            for (User user : userList) {
                // 가민에 토큰 삭제요청
                deleteToken(user);
            }
        }
        logger.info("Expire Delete User End : {} ", userList.size());
    }

    public void deleteToken(User user) {
        String code = "N";
        try {
            final AbstractOAuth10aRequestHeader tcHeader =
                    new DeregistrationRequestHeader(
                            this.deregistrationURL,
                            this.consumerKey,
                            this.consumerSecret,
                            user.getUserAccessToken(),
                            user.getUserAccessTokenSecret());

            final ResponseEntity<String> response = this.oAuthService.deregister(tcHeader);

            // User Table 에러일 경우 사용여부 E로 변경
            if (!response.getStatusCode().equals(HttpStatus.OK)) {
                code = "E";
            }
        } catch (Exception e){
            code = "E";
            e.printStackTrace();
        }
        logger.info("Expire Delete User : {}, code : {}", user, code);
        userMapper.editExpireUser(user.getId(), code);
    }

}
