package com.example.project.post.service;

import com.example.project.post.domain.NoticeWriteRequest;
import com.example.project.post.entity.Notices;
import com.example.project.post.repository.NoticeRepository;
import com.example.project.user.domain.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class NoticeService {

    private final NoticeRepository noticeRepository;

    public ApiResponse<?> noticeWrite(NoticeWriteRequest request) {

        try {


            Notices entity = Notices.builder()
                    .userId(request.getUserId())
                    .title(request.getTitle())
                    .content(request.getContent())
                    .views(0)
                    .build();

            log.info("저장할 Notices 엔티티: {}", entity);
            noticeRepository.save(entity);
            return ApiResponse.success("공지사항 작성 성공");
        } catch (Exception e) {
            log.error("공지사항 DB 저장 실패! 원인: ", e);
            // 사용자에게는 일반적인 오류 응답을 반환하도록 재처리합니다.
            throw new RuntimeException("DB 저장 중 알 수 없는 오류 발생", e);
        }
    }
}
