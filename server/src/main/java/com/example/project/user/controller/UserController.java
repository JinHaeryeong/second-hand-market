package com.example.project.user.controller;

import com.example.project.user.domain.*;
import com.example.project.user.entity.Member;
import com.example.project.user.entity.Role;
import com.example.project.user.service.UserService;
import com.example.project.user.util.JwtUtil;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;



    @PostMapping("/signup")
    public ResponseEntity<ApiResponse> signUp(@RequestBody SignUpRequest request) {
        userService.createMember(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("회원가입이 성공적으로 완료되었습니다."));
    }

    @PostMapping("/signin")
    public ResponseEntity<ApiResponse> userSignIn(@RequestBody SignInRequest request) {
        return ResponseEntity.ok(userService.signIn(request, Role.ROLE_USER));
    }
    @PostMapping("/signout")
    public ResponseEntity<ApiResponse> signOut(@AuthenticationPrincipal Member member) {
        log.info("signout 들어옴");
        log.info(member.toString());
        String id = member.getUserId();
        log.info("로그아웃을 시도하는 사용자 ID: {}", id);
        log.info("아니 뭐하자는거임");
        int affectedRows = userService.updateRefreshToken(id, null);
        log.info("ID: {}, Affected Rows: {}", id, affectedRows);
        if(affectedRows > 0) {
            log.info("success 들어옴");
            return ResponseEntity.ok(ApiResponse.success("로그아웃 되었습니다."));
        } else {
            log.info("fail 들어옴");
            return ResponseEntity.badRequest().body(ApiResponse.error("fail","FAILED_SIGNOUT"));
        }
    }
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> req){
        String refreshToken = req.get("refreshToken");
        log.info("요청한 refreshToken===={}",refreshToken);
        if(refreshToken==null){
            return ResponseEntity.status(401).body("refreshToken이 없습니다");
        }
        try{
            Claims claims=jwtUtil.validateToken(refreshToken);
            //Long id=Long.valueOf(claims.get("id").toString());
            String userId=claims.get("id", String.class);
            Optional<Member> opt=userService.findByUserId(userId);
            if(opt.isEmpty() || !refreshToken.equals(opt.get().getRefreshToken())){
                return ResponseEntity.status(403).body("인증되지 않은 회원입니다(리프레시 토큰값 다름)");
            }

            Member user = opt.get();
            String newAccessToken = jwtUtil.generateAccessToken(user);

            return ResponseEntity.ok(Map.of("accessToken", newAccessToken));

        }catch (Exception ex){
            log.error("refreshToken error: "+ex.getMessage());
            return ResponseEntity.status(403).body("인증되지 않은 사용자입니다(refreshToken 유효하지 않음)");
        }

    }
    @GetMapping("/user")
    public ResponseEntity<?> getAuthUser(@AuthenticationPrincipal Member authUser) {
        log.info(authUser.toString());
        log.info("인증된 사용자: {}", authUser.getUserId());
        SignInResponse response = new SignInResponse(
                authUser.getName(),
                authUser.getEmail(),
                authUser.getNickname(),
                authUser.getUserId(),
                authUser.getRole().toString()
        );
        return ResponseEntity.ok(ApiResponse.success("인증된 사용자 정보입니다.", response));
    }
}
