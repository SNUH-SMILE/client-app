package kr.uracle.smile.module.authentication;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserMapper {

    int addUser(User params);

    int addSeers(UserRequest.addSeers params);

    int editSeers(UserRequest.addSeers params);

    int editUseYn(@Param("id") int id);

    User getTokenToUser(String token);

    User getAdditionUserCodeToUser(@Param("additionUserCode") String additionUserCode, @Param("loginId") String loginId);

    User getLoginIdToUser(String loginId);

    List<User> getExpireTokenUser();

    int editExpireUser(@Param("id") int id, @Param("code") String code);

    List<User> getAdditionUserCode();

}
