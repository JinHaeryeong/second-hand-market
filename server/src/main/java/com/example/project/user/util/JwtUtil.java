package com.example.project.user.util;

import com.example.project.user.entity.Member;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.Map;

@Component
public class JwtUtil {
    private final Key key;
    private final long accessTokenExipiration;
    private final long refreshTokenExipiration;
    
    //application-dev.yml에 설정한 jwt.security 등에 해당하는 값을 가져와서
    //인자 생성자 통해 주입하자

    public JwtUtil(@Value("${jwt.secret}") String secret,
                   @Value("${jwt.access-token-expiration}") long accessTokenExipiration,
                   @Value("${jwt.refresh-token-expiration}") long refreshTokenExipiration) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes()); //HMAC SHA 알고리즘에 맞는 Key 생성
        this.accessTokenExipiration = accessTokenExipiration;
        this.refreshTokenExipiration = refreshTokenExipiration;
    }

    public String generateToken(Map<String, Object> payloads, long expiration) {
        return Jwts.builder()
                .setClaims(payloads) //payload (사용자 정보)
                .setIssuedAt(new Date()) //발급일
                .setExpiration(new Date(System.currentTimeMillis()+expiration)) //만료시간
                .signWith(key, SignatureAlgorithm.HS256) //서명
                .compact();
    }

    public String generateAccessToken(Member user) {
        Map<String, Object> payloads = Map.of("id", user.getUserId());
        return generateToken(payloads, accessTokenExipiration);
    }
    public String generateRefreshToken(Member user) {
        Map<String, Object> payloads = Map.of("id", user.getUserId());
        return generateToken(payloads, refreshTokenExipiration);
    }
    
    //JWT 검증: key 이용해서 토큰이 유효한지 확인하고, 만료시간 체크, jwt 구조(헤더.페이로드.서명)가 올바른지 체크
    
    public Claims validateToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key)
                .build() //JWTParser
                .parseClaimsJws(token) // 토큰 검증 및 파싱
                .getBody(); //jwt의 payload(Claims) 추출
    }
}
