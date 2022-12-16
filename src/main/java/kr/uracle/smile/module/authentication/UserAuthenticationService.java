package kr.uracle.smile.module.authentication;

import kr.uracle.smile.support.batch.ScheduledTasks;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public void deleteUser(UserRequest.Delete request) {
        User user = userMapper.getLoginIdToUser(request.getLoginId());

        if (user != null) {
            // 가민 토큰삭제
            if (user.getUserAccessToken() != null && "".equals(user.getUserAccessToken())) {
                scheduledTasks.deleteToken(user);
            }

            // 유저 테이블 비활성 상태로 변경
            userMapper.editUseYn(user.getId());
        }
    }

    public void addSeers(UserRequest.addSeers request) {
        // id가 있으면 update 없으면 insert
        User user  = userMapper.getLoginIdToUser(request.getLoginId());
        if (user == null) {
            userMapper.addSeers(request);
        } else {
            userMapper.editSeers(request);
        }
    }
}
