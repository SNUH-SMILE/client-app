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

    public int dupLoginIdCheck(String loginId, String userToken, String userSecret) {
        int result = 0;
        User user = userMapper.getLoginIdToUser(loginId);
        if (user != null) {
            if (user.getUserAccessToken() == null) {
                dupTokenCheck(loginId, userToken);
                // userToken Update
                result = userMapper.editAccessTokenToUser(loginId, userToken, userSecret);
                return result;
            }
            if (user.getUserAccessToken().equals(userToken)) {
                userMapper.editUseYn(user.getId());
            } else {
                scheduledTasks.deleteToken(user);
            }
        }

        dupTokenCheck(loginId, userToken);
        return result;
    }

    public void dupTokenCheck(String loginId, String userToken) {
        // 동일한 가민가입정보로 다른 유저가 요청하였을 경우 현재 요청한 유저가 활성화모드로 적용
        User tokenUser = userMapper.getTokenToUser(userToken);
        if (tokenUser != null && (loginId != null && !loginId.equals(tokenUser.getLoginId()))) {
            userMapper.editUseYn(tokenUser.getId());
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
