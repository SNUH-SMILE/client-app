package kr.uracle.smile.module.authentication;

import io.swagger.annotations.ApiModelProperty;

import kr.uracle.smile.support.mybatis.AbstractAuditEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.validator.constraints.Length;
import org.springframework.security.core.CredentialsContainer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static kr.uracle.smile.support.validator.ValidationGroup.OnInsert;
import static kr.uracle.smile.support.validator.ValidationGroup.OnUpdate;

/**
 * 관리자 정보
 */
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Admin extends AbstractAuditEntity implements UserDetails, CredentialsContainer  {

    @ApiModelProperty(value = "아이디", required = true, position = 1, example = "admin")
    @NotBlank( groups = {OnUpdate.class, OnInsert.class} )
    @Length(max = 50)
    private String username;

    @ApiModelProperty(value = "비밀번호", required = true, position = 2, example = "0000")
    @Length(max = 96)
    @NotNull
    private String password;

    @ApiModelProperty(value = "이름", required = true, position = 3, example = "홍길동")
    @NotNull( groups = {OnUpdate.class, OnInsert.class})
    @Length(max = 10)
    private String name;

    @ApiModelProperty(value = "이메일주소", position = 5, example = "amdin@uracle.co.kr")
    @Email( groups = {OnInsert.class})
    private String email;

    @ApiModelProperty(value = "휴대전화번호", position = 6, example = "010-0000-0000")
    @Length(max = 50)
    private String mobile;

    @ApiModelProperty(value = "사용여부", position = 7, example = "Y")
    @NotNull( groups = {OnUpdate.class, OnInsert.class} )
    private boolean enabled;

    @ApiModelProperty(value = "권한 목록", position = 12, hidden = true)
    private List<GrantedAuthority> authorities;

    @ApiModelProperty(value = "비밀번호 만료 여부", position = 13, hidden = true)
	private boolean credentialsNonExpired = true;
    
    public Admin(String username, String password, String name, List<GrantedAuthority> authorities) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.authorities = authorities;
        this.enabled = true;
    }

    /**
     * 사용자 권한 목록
     *
     * @return 사용자 권한 목록 문자열 배열 반환
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> authorities =  new ArrayList<>();
        authorities.add( new SimpleGrantedAuthority("ROLE_ADMIN"));
        return authorities;
    }

    /**
     * 사용자 권한 보유 여부
     *
     * @param role 권한
     * @return 보유 여부
     */
    public boolean hasAuthority(String role) {
        return this.authorities.stream().anyMatch(authority -> authority.getAuthority().equals(role));
    }

    /**
     * 사용자 계정 만료 여부
     *
     * @return 만료 된 사용자 false 반환
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * 사용자 계정 잠금 여부
     *
     * @return 잠금 된 사용자 false 반환
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * 비밀번호 만료 여부
     *
     * @return 만료 시 false 반환
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return credentialsNonExpired;
    }

    /**
     * 사용자 계정 활성화 여부
     *
     * @return 비활성 사용자 false 반환
     */
    @Override
    public boolean isEnabled() {
        return enabled;
    }

    /**
     * 개인정보 보호를 위한 불필요한 사용자 정보 제거
     * 로그인 이후 자동으로 호출되므로, 인증 이후 필요하지 않은 항목은 여기서 제거한다.
     */
    @Override
    public void eraseCredentials() {
        password = null;
    }

}
