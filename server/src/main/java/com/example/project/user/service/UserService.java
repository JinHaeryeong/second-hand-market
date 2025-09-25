package com.example.project.user.service;

import com.example.project.exception.DuplicateEmailException;
import com.example.project.exception.DuplicateNicknameException;
import com.example.project.exception.DuplicateUserIdException;
import com.example.project.exception.ValidationException;
import com.example.project.user.domain.ApiResponse;
import com.example.project.user.domain.SignInRequest;
import com.example.project.user.domain.SignUpRequest;
import com.example.project.user.entity.Member;
import com.example.project.user.entity.Role;
import com.example.project.user.repository.MemberRepository;
import com.example.project.user.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

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

    public ApiResponse signIn(SignInRequest request, Role requiredRole) {
        Optional<Member> optionalUser = memberRepository.findByUserId(request.getId());

        if (optionalUser.isEmpty() || !passwordEncoder.matches(request.getPwd(), optionalUser.get().getPassword())) {
            return ApiResponse.error("아이디 또는 비밀번호가 일치하지 않아요.", "UNMATCHED_CREDENTIALS");
        }

        Member user = optionalUser.get();

        if (user.getRole() != requiredRole) {
            return ApiResponse.error("아이디 또는 비밀번호가 일치하지 않아요.", "UNMATCHED_CREDENTIALS");
        }

        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        user.setRefreshToken(refreshToken);
        updateRefreshToken(user); // DB에 리프레시 토큰 저장

        return ApiResponse.success(
                "로그인 되었습니다.",
                Map.of("name", user.getName(),
                        "email", user.getEmail(),
                        "nickname", user.getNickname(),
                        "id", user.getUserId(),
                        "role", user.getRole(),
                        "accessToken", accessToken,
                        "refreshToken", refreshToken
                )
        );
    }

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
