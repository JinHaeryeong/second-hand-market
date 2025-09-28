package com.example.project.user.service;

import com.example.project.post.domain.NoticesListRequest;
import com.example.project.post.entity.Notices;
import com.example.project.user.domain.ApiResponse;
import com.example.project.user.domain.UsersResponse;
import com.example.project.user.entity.Member;
import com.example.project.user.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Slf4j
@Service // 이 클래스를 Spring Service로 등록합니다.
@RequiredArgsConstructor // 의존성 주입을 위한 Lombok 어노테이션입니다.
public class AdminService {

    private final MemberRepository memberRepository;
    public ApiResponse<Page<UsersResponse>> getAllUsers(Pageable pageable, String keyword) {
        Page<Member> entityPage=null;
        if(keyword==null||keyword.equals("")){
            log.info("아니 이거들어올텐데??");
            entityPage = memberRepository.findAll(pageable);// 전체 검색
        } else {
            entityPage=Page.empty();
        }
        Page<UsersResponse> users = entityPage.map(member ->
                UsersResponse.builder()
                        .id(member.getUserId())
                        .name(member.getName())
                        .email(member.getEmail())
                        .role(String.valueOf(member.getRole()))
                        .age(member.getAge())
                        .city(member.getCity())
                        .nickname(member.getNickname())
                        .createdAt(member.getCreatedAt())
                        // ... 필요한 필드를 member 엔티티에서 가져와 설정
                        .build()
        );

        return ApiResponse.success("유저 목록 조회 성공", users);
    }
}
