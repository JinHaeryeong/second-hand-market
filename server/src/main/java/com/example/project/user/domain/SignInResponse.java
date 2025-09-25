package com.example.project.user.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SignInResponse {
    private String name;
    private String email;
    private String nickname;
    private String id;
    private String role;
}
