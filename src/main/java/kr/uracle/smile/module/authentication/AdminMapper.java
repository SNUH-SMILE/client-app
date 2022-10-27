package kr.uracle.smile.module.authentication;

import kr.uracle.smile.support.mybatis.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminMapper {

    // 관리자 상세조회
    Admin getAdmin(@Param("username") String username);

}
