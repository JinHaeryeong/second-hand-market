package com.example.project.admin.service;

import com.example.project.admin.domain.MemberDto;
import com.example.project.admin.repository.MemberRepository;
import com.example.project.admin.entity.Member;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {
    private final MemberRepository memberRepository;

    public AdminService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public List<MemberDto> findAllUser() {
        List<Member> members = memberRepository.findAll();
        return members.stream()
                .map(MemberDto::fromEntity)
                .collect(Collectors.toList());
    }
}
