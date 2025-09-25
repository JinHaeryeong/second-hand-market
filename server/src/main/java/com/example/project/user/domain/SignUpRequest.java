package com.example.project.user.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SignUpRequest {
    private String name;
    private String nickname;
    private String email;
    private String id;
    private String pwd;
    private String city;
    private String pwdCheck;
    private int age;
}