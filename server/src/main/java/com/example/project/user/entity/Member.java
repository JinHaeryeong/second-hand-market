package com.example.project.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity(name = "UserMember")
@Table(name = "member")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@AllArgsConstructor
@ToString
public class Member implements UserDetails {

    @Id //PK에 붙인다
    @Column(name = "user_id")
    private String userId;

    @Column(name="user_name")
    private String name;

    @Column
    private String email;

    @Column
    private String nickname;

    @Column
    private String city;

    @Column
    private Integer age;


    @Column(name = "password")
    private String userPwd;


    @Column(name = "created_at")
    private LocalDateTime createdAt;


    @Column(name="refreshToken")
    @Setter
    private String refreshToken;

    @Enumerated(EnumType.STRING) // Enum 타입을 DB에 문자열로 저장
    @Builder.Default
    @Column(name = "role")
    private Role role = Role.ROLE_USER;

    public Collection<? extends GrantedAuthority> getAuthorities() {
        // DB에는 USER,ADMIN ==> SECURITY 에서는 "ROLE_" 접두어를 붙여 반환해야 함
        // ROLE_USER, ROLE_ADMIN, ROLE_GUEST ....
        return List.of(new SimpleGrantedAuthority(this.role.toString()));
    }

    @Override
    public String getPassword() {
        return  this.userPwd;
    }

    @Override
    public String getUsername() { //unique한 필드 반환
        return this.userId;
    }


    @Override//계정 만료 여부
    public boolean isAccountNonExpired() {
        return true;//=> 만료되지 않았단 의미.
    }

    //계정 잠금 여부 반환
    @Override
    public boolean isAccountNonLocked() {
        return true;//=> 잠금되지 않음
    }

    //패스워드 만료 여부 반환
    @Override
    public boolean isCredentialsNonExpired() {
        return true;//만료되지 않음
    }
    //계정 사용 가능 여부 반환
    @Override
    public boolean isEnabled() {
        return true;//=> 사용 가능
    }
}
