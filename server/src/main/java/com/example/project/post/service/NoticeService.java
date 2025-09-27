package com.example.project.post.service;

import com.example.project.post.domain.NoticeEditRequest;
import com.example.project.post.domain.NoticeWriteRequest;
import com.example.project.post.domain.NoticesListRequest;
import com.example.project.post.entity.Notices;
import com.example.project.post.repository.NoticeRepository;
import com.example.project.user.domain.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;
import org.jsoup.safety.Safelist;
import org.jsoup.select.Elements;
import org.jsoup.select.NodeVisitor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class NoticeService {

    private final NoticeRepository noticeRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    private static final Set<String> ALLOWED_CSS_PROPERTIES = new HashSet<>(Arrays.asList(
            "font-size",
            "font-family",
            "color",
            "background-color",
            "text-align",
            "line-height",
            "width",
            "height"
    ));
    private static final Safelist CUSTOM_SAFELIST;

    private static final Pattern CSS_PROPERTY_PATTERN = Pattern.compile("([^:]+):\\s*([^;]+)(;|$)");

    static {
        Safelist safelist = Safelist.relaxed();

        safelist.addTags("img");

        safelist.addAttributes("img", "src", "alt", "width", "height", "style");

        safelist.removeProtocols("img", "src", "http", "https");

        safelist.preserveRelativeLinks(true);


        CUSTOM_SAFELIST = safelist;
    }

    // css 관련 설정한건 안먹히는거같아서 좀 더 고민해보기... 아마 relaxed()의 문제인거같긴함
    private Safelist getCustomSafelist() {
        return CUSTOM_SAFELIST;
    }

    private String applyCssWhitelistFiltering(String html) {
        // Jsoup의 기본 정제 후, Document로 파싱하여 순회 필터링
        Document doc = Jsoup.parseBodyFragment(html);
        doc.traverse(new CssAttributeFilteringVisitor());
        return doc.body().html();
    }

    public ApiResponse<?> editPostById(Integer id, NoticeEditRequest noticeEditRequest) {
        Notices entity = noticeRepository.findById(id.longValue())
                .orElseThrow(() -> new RuntimeException("공지사항이 없습니다."));

        String unsafeContent = noticeEditRequest.getContent();
        String semiSafeContent = Jsoup.clean(unsafeContent, getCustomSafelist());
        String safeContent = applyCssWhitelistFiltering(semiSafeContent);

        entity.setTitle(noticeEditRequest.getTitle());
        entity.setContent(noticeEditRequest.getContent());
        entity.setUpdatedAt(LocalDateTime.now());

        log.info("공지사항 수정 완료 ID: {}", id);
        return ApiResponse.success("공지사항이 성공적으로 수정되었습니다.");
    }

    private class CssAttributeFilteringVisitor implements NodeVisitor {
        @Override
        public void head(Node node, int depth) {
            if (node instanceof Element) {
                Element element = (Element) node;
                // style 속성이 있는 경우에만 처리
                if (element.hasAttr("style")) {
                    String originalStyle = element.attr("style");
                    String filteredStyle = filterCssProperties(originalStyle);

                    if (filteredStyle.isEmpty()) {
                        element.removeAttr("style"); // 남은 스타일 없으면 속성 제거
                    } else {
                        element.attr("style", filteredStyle); // 필터링된 스타일로 갱신
                    }
                }
            }
        }

        @Override
        public void tail(Node node, int depth) {
            // Do nothing
        }

        /**
         * CSS 문자열을 분석하여 ALLOWED_CSS_PROPERTIES에 있는 속성만 남기는 핵심 로직
         */
        private String filterCssProperties(String css) {
            StringBuilder safeCss = new StringBuilder();
            Matcher matcher = CSS_PROPERTY_PATTERN.matcher(css);

            while (matcher.find()) {
                String property = matcher.group(1).trim().toLowerCase();
                String value = matcher.group(2).trim();

                // 화이트리스트에 해당 속성이 있는지 확인
                if (ALLOWED_CSS_PROPERTIES.contains(property)) {
                    // 값(value) 자체에 대한 검증 로직은 생략되었으나,
                    // 실제 서비스에서는 url(...) 함수 사용 금지 등의 추가적인 보안 검증이 필요합니다.
                    safeCss.append(property).append(": ").append(value).append("; ");
                }
            }
            return safeCss.toString().trim();
        }
    }
    public ApiResponse<?> noticeWrite(NoticeWriteRequest request) {

        try {
            String unsafeContent = request.getContent();
            log.info(unsafeContent);
            String semiSafeContent = Jsoup.clean(unsafeContent, getCustomSafelist()); // ⭐️ 정화된 내용 사용
            String safeContent = applyCssWhitelistFiltering(semiSafeContent);
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

        noticeDto.setContent(entity.getContent());

        return ApiResponse.success("글 가져옴", noticeDto);
    }

    public ApiResponse<?> deletePostById(Integer id) {
        Notices entity = noticeRepository.findById(id.longValue())
                .orElseThrow(() -> new RuntimeException("삭제할 글을 찾지 못했습니다. ID: " + id));
        String htmlContent = entity.getContent();
        if (htmlContent != null && !htmlContent.isEmpty()) {
            try {
                // HTML 파싱
                Document doc = Jsoup.parse(htmlContent);
                // 모든 <img> 태그 선택
                Elements images = doc.select("img");

                images.forEach(img -> {
                    String src = img.attr("src");

                    // src가 /api/file/ 로 시작하는 업로드 파일인지 확인
                    if (src.startsWith("/api/file/")) {
                        String fileName = src.substring("/api/file/".length());

                        // 서버의 실제 파일 경로를 생성
                        File fileToDelete = new File(uploadDir, fileName);

                        if (fileToDelete.exists()) {
                            // 파일 삭제 시도
                            if (fileToDelete.delete()) {
                                log.info("이미지 파일 삭제 성공: {}", fileToDelete.getAbsolutePath());
                            } else {
                                log.warn("이미지 파일 삭제 실패 (권한 문제 등): {}", fileToDelete.getAbsolutePath());
                            }
                        } else {
                            log.warn("삭제하려는 이미지 파일이 서버에 존재하지 않습니다: {}", fileToDelete.getAbsolutePath());
                        }
                    }
                });
            } catch (Exception e) {
                // 파일 삭제는 부가적인 작업이므로, 오류가 발생해도 글 삭제 자체는 진행
                log.error("공지사항 ID {}의 이미지 파일 삭제 중 오류 발생: {}", id, e.getMessage());
            }
        }
        noticeRepository.delete(entity);
        log.info("공지사항 DB 삭제 완료: ID {}", id);

        return ApiResponse.success("공지사항 및 관련 파일 삭제 성공");
    }
}
