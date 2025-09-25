// src/main/java/com/example/project/user/service/UserDetailsServiceImpl.java
package com.example.project.user.service;

import com.example.project.user.entity.Member;
import com.example.project.user.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service // 이 클래스를 Spring Service로 등록합니다.
@RequiredArgsConstructor // 의존성 주입을 위한 Lombok 어노테이션입니다.
public class UserDetailsServiceImpl implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // username(여기서는 userId)을 이용해 DB에서 Member를 찾습니다.
        log.info("UserDetailsServiceImple들어옴");
        log.info(username);
        Member member = memberRepository.findByUserId(username)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + username));
        return member; // Member 엔티티가 UserDetails 인터페이스를 구현했으므로 바로 반환 가능합니다.
    }
}