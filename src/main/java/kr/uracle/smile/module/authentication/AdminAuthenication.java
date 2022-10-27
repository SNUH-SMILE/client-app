package kr.uracle.smile.module.authentication;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Slf4j
public class AdminAuthenication {
    private String id;
    private String name;
    private List<String> authorities =  new ArrayList<>();

    public AdminAuthenication(){ }

    public AdminAuthenication(String id, String name, Collection<? extends GrantedAuthority> grantedAuthorities ){
        this.id = id;
        this.name = name;
        for( GrantedAuthority auth : grantedAuthorities ){
            this.authorities.add(auth.getAuthority());
        }
    }
}

