package com.example.project.user.repository;

import com.example.project.user.entity.Member;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository("userMemberRepository")
public interface MemberRepository extends JpaRepository<Member, String> {
    // JpaRepository를 상속하면 save(), findAll(), findById() 등 기본 메서드는 자동으로 사용할 수 있습니다.
    Optional<Member> findByUserId(String userId);
    Optional<Member> findByNickname(String nickname);
    Optional<Member> findByEmail(String email);
    @Query("SELECT  m.refreshToken    FROM UserMember m where m.userId = :userId")
    String findRefreshTokenByUserId(@Param("userId") String userId);

    @Transactional
    @Modifying
    @Query("UPDATE UserMember m SET m.refreshToken=:refreshToken WHERE m.userId = :id")
    int updateRefreshToken(String id, String refreshToken);
    //query method   => select * from spring_member where email=?
}