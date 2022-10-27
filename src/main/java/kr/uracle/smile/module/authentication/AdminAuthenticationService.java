package kr.uracle.smile.module.authentication;

import kr.uracle.smile.config.SMILEProperties;
import kr.uracle.smile.module.authentication.Admin;
import kr.uracle.smile.module.authentication.AdminService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * 로그인 시 사용자 정보 조회를 위한 서비스
 */
@Slf4j
@Service
public class AdminAuthenticationService implements UserDetailsService {

    @Autowired
    private AdminService adminService;

    /**
     * 사용자 정보 조회
     *
     * @param username 사용자 아이디
     * @return 사용자 정보
     * @throws UsernameNotFoundException
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.debug("Sign-in request username: {}", username);

        // DB 사용자 정보 조회
        Admin user = adminService.getAdmin(username);
        if(user == null) {
            throw new UsernameNotFoundException("등록되지 않은 사용자");
        }

        List<GrantedAuthority> roleList = Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"));
        user.setAuthorities(roleList);

        return user;
    }


}
