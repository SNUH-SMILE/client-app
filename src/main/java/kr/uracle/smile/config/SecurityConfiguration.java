package kr.uracle.smile.config;

import kr.morpheus.framework.security.Sha256PasswordEncoder;
import org.aopalliance.intercept.MethodInterceptor;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.AccessDecisionManager;
import org.springframework.security.access.AccessDecisionVoter;
import org.springframework.security.access.intercept.aopalliance.MethodSecurityInterceptor;
import org.springframework.security.access.vote.AffirmativeBased;
import org.springframework.security.access.vote.AuthenticatedVoter;
import org.springframework.security.access.vote.RoleVoter;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Spring Security 설정
 */
@Configuration(proxyBeanMethods = false)
public class SecurityConfiguration implements InitializingBean {
    private final MethodInterceptor methodSecurityInterceptor;

    public SecurityConfiguration(MethodInterceptor methodSecurityInterceptor) {
        this.methodSecurityInterceptor = methodSecurityInterceptor;
    }

    /**
     * SpringSecurity AccessDecisionManager 교체 처리
     * @throws Exception
     */
    @Override
    public void afterPropertiesSet() throws Exception {
        Assert.isInstanceOf(MethodSecurityInterceptor.class, methodSecurityInterceptor);
        ((MethodSecurityInterceptor)methodSecurityInterceptor).setAccessDecisionManager(accessDecisionManager());
    }

    /**
     * 사용자 권한 보유 여부 판단을 위한 AccessDecisionManager
     * @return AccessDecisionManager
     */
    private AccessDecisionManager accessDecisionManager() {
        List<AccessDecisionVoter<? extends Object>> decisionVoters = new ArrayList<>();
        decisionVoters.add(new RoleVoter());
        decisionVoters.add(new AuthenticatedVoter());
        return new AffirmativeBased(decisionVoters);
    }

    /**
     * Password Encoder 설정
     * 비밀번호에 {noop} prefix가 붙는 경우 plain text로 검사
     * 존재하지 않는 경우 또는 {msp} prefix가 붙는 경우 Sha256PasswordEncoder 사용
     * @return PasswordEncoder
     */
    @SuppressWarnings("deprecation")
    @Bean
    public PasswordEncoder passwordEncoder() {
        String defaultEncoder = "msp";

        Map<String, PasswordEncoder> encoders = new HashMap<>();
        encoders.put("noop", NoOpPasswordEncoder.getInstance());
        encoders.put(defaultEncoder, new Sha256PasswordEncoder());

        DelegatingPasswordEncoder passwordEncoder = new DelegatingPasswordEncoder(defaultEncoder, encoders);
        passwordEncoder.setDefaultPasswordEncoderForMatches(encoders.get(defaultEncoder));
        return passwordEncoder;
    }

}
