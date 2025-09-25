package com.example.project.admin.repository;

import com.example.project.admin.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository("adminMemberRepository")
public interface MemberRepository extends JpaRepository<Member, Integer> {
}
