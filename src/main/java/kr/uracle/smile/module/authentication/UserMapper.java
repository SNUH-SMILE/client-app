package kr.uracle.smile.module.authentication;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserMapper {

    int addUser(User params);

    User getTokenToUser(String token);

    User getLoginIdToUser(String loginId);

    List<User> getExpireTokenUser();

    int editExpireUser(@Param("id") int id, @Param("code") String code);

}
