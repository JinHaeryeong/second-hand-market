package com.example.project.user.service;

import com.example.project.exception.DuplicateEmailException;
import com.example.project.exception.DuplicateNicknameException;
import com.example.project.exception.DuplicateUserIdException;
import com.example.project.exception.ValidationException;
import com.example.project.user.domain.SignInRequest;
import com.example.project.user.domain.SignUpRequest;
import com.example.project.user.entity.Member;
import com.example.project.user.entity.Role;
import com.example.project.user.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public Member createMember(SignUpRequest request){
        if (memberRepository.findByUserId(request.getId()).isPresent()) {
            throw new DuplicateUserIdException("이미 존재하는 아이디입니다.");
        }
        if (memberRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateEmailException("이미 존재하는 이메일입니다.");
        }
        if (memberRepository.findByNickname(request.getNickname()).isPresent()) {
            throw new DuplicateNicknameException("이미 존재하는 닉네임입니다.");
        }

        String encodedPassword = passwordEncoder.encode(request.getPwd());
        //DTO 를 Entity로 변환
        Member entity = Member.builder()
                .name(request.getName())
                .nickname(request.getNickname())
                .email(request.getEmail())
                .userId(request.getId())
                .city(request.getCity())
                .userPwd(encodedPassword) // 🔑 암호화된 비밀번호 저장
                .age(request.getAge())
                .build();

        Member newUser = memberRepository.save(entity);
        log.info("newUser===={}",newUser);
        return newUser;
    }

//    public Member signInMember(SignInRequest request) {
//        // 1. 유저 ID로 회원 정보 찾기
//        log.info("이거 signInMember 들어옴?");
//        Member member = memberRepository.findByUserId(request.getUserId())
//                .orElseThrow(() -> new UsernameNotFoundException("아이디 또는 비밀번호가 일치하지 않습니다."));
//
//        // 2. 입력된 비밀번호와 저장된 암호화된 비밀번호가 일치하는지 확인
//        if (!passwordEncoder.matches(request.getPassword(), member.getUserPwd())) {
//            // 비밀번호가 일치하지 않으면 BadCredentialsException을 던짐
//            throw new BadCredentialsException("아이디 또는 비밀번호가 일치하지 않습니다.");
//        }
//
//        // 3. 관리자 계정은 일반 로그인 페이지에서 로그인 차단
//        if (member.getRole() == Role.ROLE_ADMIN) {
//            throw new BadCredentialsException("관리자 계정은 여기서 로그인할 수 없습니다.");
//        }
//
//        // 4. 모든 검증 통과 시 Member 객체 반환
//        return member;
//    }

    public Optional<Member> findByUserId(String userId) {
        return memberRepository.findByUserId(userId);
    }

    public void updateRefreshToken(Member user) {
        memberRepository.save(user);
    }
    public int updateRefreshToken(String id, String refreshToken) {
        return memberRepository.updateRefreshToken(id, refreshToken);
    }
}
