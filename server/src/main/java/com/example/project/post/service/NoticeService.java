package com.example.project.post.service;

import com.example.project.post.domain.NoticeWriteRequest;
import com.example.project.post.domain.NoticesListRequest;
import com.example.project.post.entity.Notices;
import com.example.project.post.repository.NoticeRepository;
import com.example.project.user.domain.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private static final Safelist CUSTOM_SAFELIST;

    static {
        Safelist safelist = Safelist.relaxed();

        safelist.addTags("img");

        safelist.addAttributes("img", "src", "alt", "width", "height", "style");

        safelist.removeProtocols("img", "src", "http", "https");

        safelist.preserveRelativeLinks(true);



        CUSTOM_SAFELIST = safelist;
    }
    private Safelist getCustomSafelist() {
        return CUSTOM_SAFELIST;
    }
    public ApiResponse<?> noticeWrite(NoticeWriteRequest request) {

        try {
            String unsafeContent = request.getContent();
            log.info(unsafeContent);
            String safeContent = Jsoup.clean(unsafeContent, getCustomSafelist()); // ⭐️ 정화된 내용 사용
            log.info(safeContent);

            Notices entity = Notices.builder()
                    .userId(request.getUserId())
                    .title(request.getTitle())
                    .content(safeContent)
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
    public ApiResponse<Page<NoticesListRequest>> getNoticesList(Pageable pageable, int findType, String keyword){
            Page<Notices> entityPage=null;
            if(findType==0||keyword==null||keyword.equals("")){
                entityPage = noticeRepository.findAll(pageable);// 전체 검색
            }else if(findType==1){// title
                entityPage = noticeRepository.findByTitleContainingIgnoreCase(keyword,pageable);
            }else if(findType==2){
                entityPage = noticeRepository.findByUserIdContainingIgnoreCase(keyword,pageable);
            }else if(findType==3) {
                entityPage = noticeRepository.findByContentContainingIgnoreCase(keyword,pageable);
            }else{
                entityPage=Page.empty();
            }
            Page<NoticesListRequest> noticesPage = entityPage.map(NoticesListRequest::fromEntity);

            return ApiResponse.success("공지사항 목록 조회 성공", noticesPage);
    }

    public ApiResponse<NoticesListRequest> getPostById(Integer id) {
        /*
        *         Post entity= postRepsoitory.findById(id)
                .orElseThrow(()->new RuntimeException("Post not found"));
        *
        * */

        Notices entity = noticeRepository.findById(id.longValue())
                .orElseThrow(() -> new RuntimeException("글을 찾지 못했어요. ID: " + id));

        entity.setViews(entity.getViews() + 1);
        // ⭐️ DTO로 변환하여 반환합니다.
        NoticesListRequest noticeDto = NoticesListRequest.fromEntity(entity);
        String unsafeHtml = entity.getContent();
        String safeHtml = Jsoup.clean(unsafeHtml, getCustomSafelist());

        noticeDto.setContent(safeHtml);

        return ApiResponse.success("글 가져옴", noticeDto);
    }
}
