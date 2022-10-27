package kr.uracle.smile.module.authentication;

import com.google.gson.Gson;
import kr.uracle.smile.module.exception.AlreadyExistsException;
import kr.uracle.smile.support.mybatis.Page;
import lombok.extern.slf4j.Slf4j;
import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Service
public class AdminService {

    @Autowired
    private AdminMapper adminMapper;
    
    @Autowired
    private Gson gson;


    /**
     * 기본 생성자
     */
    public AdminService() {
    }

    /**
     * 사용자 정보 조회
     *
     * @param username 사용자 아이디
     * @return 사용자 정보
     */
    public Admin getAdmin(String username) {
        return adminMapper.getAdmin(username);
    }


}
