package kr.uracle.smile.module.authentication;

import kr.uracle.smile.support.batch.ScheduledTasks;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UserAuthenticationService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private ScheduledTasks scheduledTasks;

    public int addUser(String loginId, String deviceId, String token, String tokenSecret) {
        User user = new User();
        user.setLoginId(loginId);
        user.setDeviceId(deviceId);
        user.setUserAccessToken(token);
        user.setUserAccessTokenSecret(tokenSecret);

        return userMapper.addUser(user);
    }

    public void dupLoginIdCheck(String loginId) {
        User user = userMapper.getLoginIdToUser(loginId);
        if (user != null) {
            scheduledTasks.deleteToken(user);
        }
    }
}
