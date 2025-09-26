package com.example.project.filter;

import com.example.project.user.entity.Member;
import com.example.project.user.repository.MemberRepository;
import com.example.project.user.util.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final MemberRepository memberRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        log.info("JwtFilter 들어옴 ***********");

        String auth = request.getHeader("Authorization");
        String token = null;
        log.info(auth);
        if (auth != null && auth.startsWith("Bearer ")) {
            token = auth.substring(7);
        }


        if (token == null || token.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }
        token = token.trim();
        log.info(token);
        try {
            // 1. JWT 토큰 검증 및 페이로드(Claims) 추출
            Claims claims = jwtUtil.validateToken(token);
            // 페이로드에서 아이디(사용자 식별 정보)만 가져옴

            String userId = claims.get("id", String.class);
            log.info(userId);

            // 2. 아이디로 DB에서 실제 Member 엔티티를 조회
            Optional<Member> memberOptional = memberRepository.findByUserId(userId);

            if (memberOptional.isEmpty()) {
                response.setStatus(401);
                response.getWriter().write("사용자를 찾을 수 없습니다.");
                return;
            }
            Member authUser= memberOptional.get();
            String refreshToken = memberRepository.findRefreshTokenByUserId(userId);
            log.info("refreshToken===={}",refreshToken);

            if(refreshToken==null){
                response.setStatus(401);
                response.getWriter().write("로그아웃된 사용자 입니다");
                return;
            }
            // 3. DB에서 조회한 실제 Member 객체를 사용



            // 4. SecurityContext에 인증 정보 저장
            var authToken = new UsernamePasswordAuthenticationToken(authUser, null, authUser.getAuthorities());
            SecurityContext ctx = SecurityContextHolder.getContext();
            ctx.setAuthentication(authToken);
            log.info("인증된 사용자 권한: {}", ctx.getAuthentication().getAuthorities());
            log.info("인증된 객체*****{}", ctx.getAuthentication().getPrincipal());
            filterChain.doFilter(request, response);


        }catch (io.jsonwebtoken.ExpiredJwtException expiredEx) {
            log.error("토큰 만료: {}", expiredEx.getMessage());
            // 🌟 만료 시 401을 명확하게 반환하여 프론트엔드의 401 인터셉터가 작동하도록 유도 🌟
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("액세스 토큰이 만료되었습니다.");
            return;
        }
        catch (Exception e) {
        log.error("토큰 검증 중 에러...", e);
        SecurityContextHolder.clearContext();
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("토큰이 유효하지 않습니다.");
        return;
    }

}
}
