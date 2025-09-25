package com.example.project.user.controller;

import com.example.project.user.domain.*;
import com.example.project.user.entity.Member;
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
    public ResponseEntity<ApiResponse> signIn(@RequestBody SignInRequest request) {
        log.info("signin 들어옴");

        // 1. AuthenticationManager를 사용하여 인증 시도
        // UsernamePasswordAuthenticationToken은 UserDetailsServiceImpl의 loadUserByUsername을 자동으로 호출
//        Authentication authentication = authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(request.getId(), request.getPwd())
//        );
//
//        // 2. 인증 성공 시 SecurityContext에 인증 정보 저장
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//
//        // 3. 인증된 사용자 정보(UserDetails)를 가져와 Member 객체 조회
//        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Optional<Member> optionalUser = userService.findByUserId(request.getId());

        // 사용자 정보가 없으면 에러 반환
        if (optionalUser.isEmpty() || !passwordEncoder.matches(request.getPwd(), optionalUser.get().getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("아이디 또는 비밀번호가 일치하지 않아요.", "UNMATHCED_ID_PWD"));
        }

        Member user = optionalUser.get();

        if (user.getRole() == com.example.project.user.entity.Role.ROLE_ADMIN) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("아이디 또는 비밀번호가 일치하지 않아요.", "ADMIN_LOGIN_NOT_ALLOWED"));
        }

        // 5. 액세스 및 리프레시 토큰 생성
        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        // 6. DB에 리프레시 토큰 저장 및 업데이트
        user.setRefreshToken(refreshToken);
        userService.updateRefreshToken(user);

        // 7. 토큰을 포함한 성공 응답 반환
        return ResponseEntity
                .ok(ApiResponse.success(
                        "로그인 되었습니다.",
                        Map.of("name", user.getName(),
                                "email",user.getEmail(),
                                "nickname", user.getNickname(),
                                "id",user.getUserId(),
                                "role",user.getRole(),
                                "accessToken", accessToken,
                                "refreshToken", refreshToken)
                ));
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
