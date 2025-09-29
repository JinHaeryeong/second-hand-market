package com.example.project.post.service;

import com.example.project.post.domain.*;
import com.example.project.post.entity.Comments;
import com.example.project.post.entity.Items;
import com.example.project.post.entity.Notices;
import com.example.project.post.repository.CommentsRepository;
import com.example.project.post.repository.ItemsRespository;
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
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class MarketService {

    private final ItemsRespository itemsRespository;
    private final CommentsRepository commentsRepository;

    @Value("${file.upload-dir}")
    private String uploadDir; // 사용되지 않는다면 제거 가능

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

    private Safelist getCustomSafelist() {
        return CUSTOM_SAFELIST;
    }

    private String applyCssWhitelistFiltering(String html) {
        // Jsoup의 기본 정제 후, Document로 파싱하여 순회 필터링
        Document doc = Jsoup.parseBodyFragment(html);
        // 내부 클래스 CssAttributeFilteringVisitor 사용
        doc.traverse(new CssAttributeFilteringVisitor());
        return doc.body().html();
    }
    private String extractFirstImageUrl(String safeContent) {
        if (safeContent == null || safeContent.isEmpty()) {
            return null;
        }
        try {
            // Jsoup으로 안전한 본문 파싱
            Document doc = Jsoup.parseBodyFragment(safeContent);
            // 첫 번째 <img> 태그 선택
            Element img = doc.select("img").first();

            if (img != null) {
                // src 속성 값 반환
                return img.attr("src");
            }
        } catch (Exception e) {
            log.warn("이미지 추출 중 오류 발생: {}", e.getMessage());
        }
        return null; // 이미지가 없거나 오류 발생 시 null 반환
    }

    private Set<String> extractFileNamesFromContent(String htmlContent) {
        Set<String> fileNames = new HashSet<>();
        if (htmlContent != null && !htmlContent.isEmpty()) {
            try {
                Document doc = Jsoup.parse(htmlContent);
                Elements images = doc.select("img");

                images.forEach(img -> {
                    String src = img.attr("src");
                    if (src.startsWith("/api/file/")) {
                        // 파일명(UUID)만 추출
                        fileNames.add(src.substring("/api/file/".length()));
                    }
                });
            } catch (Exception e) {
                log.error("HTML에서 파일명 추출 중 오류 발생: {}", e.getMessage());
            }
        }
        return fileNames;
    }

    // MarketService.java 내부에 추가할 헬퍼 메서드
    private void deleteFiles(Set<String> fileNamesToDelete) {
        fileNamesToDelete.forEach(fileName -> {
            File fileToDelete = new File(uploadDir, fileName);
            if (fileToDelete.exists()) {
                if (!fileToDelete.delete()) {
                    log.warn("이미지 파일 삭제 실패 (권한 문제 등): {}", fileToDelete.getAbsolutePath());
                } else {
                    log.info("수정으로 인한 이미지 파일 삭제 성공: {}", fileToDelete.getAbsolutePath());
                }
            }
        });
    }

    // --- 1. 상품 목록 조회 (List) ---
    public ApiResponse<Page<ItemListResponse>> getItemList(Pageable pageable, int findType, String keyword) {
        Page<ItemListResponse> responsePage;

        // 키워드가 없거나 전체 검색 시
        if (findType == 0 || keyword == null || keyword.equals("")) {
            responsePage = itemsRespository.findAllWithCategoryName(pageable);
        }
        // 제목 검색
        else if (findType == 1) {
            responsePage = itemsRespository.findByTitleContainingIgnoreCase(keyword, pageable);
        }
        // 작성자 ID 검색
        else if (findType == 2) {
            responsePage = itemsRespository.findByUserIdContainingIgnoreCase(keyword, pageable);
        }
        // 내용 검색
        else if (findType == 3) {
            responsePage = itemsRespository.findByContentContainingIgnoreCase(keyword, pageable);
        }
        // 그 외
        else {
            responsePage = Page.empty(pageable);
        }

        // Repository에서 이미 DTO Projection을 사용했으므로 추가 변환(map) 로직은 필요 없습니다.
        return ApiResponse.success("상품 목록 조회 성공", responsePage);
    }

    // --- 2. 상품 작성 (Write) ---
    public ApiResponse<?> sellItemWrite(MarketWriteRequest request) {
        try {
            String unsafeContent = request.getContent();
            String semiSafeContent = Jsoup.clean(unsafeContent, getCustomSafelist());
            String safeContent = applyCssWhitelistFiltering(semiSafeContent);


            String thumbnailUrl = extractFirstImageUrl(safeContent);

            // request.getCategory()가 int categoryId를 반환한다고 가정
            Items entity = Items.builder()
                    .userId(request.getUserId())
                    .title(request.getTitle())
                    .content(safeContent)
                    .categoryId(request.getCategory()) // int 타입 categoryId 사용
                    .price(request.getPrice())
                    .thumbnailUrl(thumbnailUrl)
                    .views(0)
                    .build();

            itemsRespository.save(entity);
            return ApiResponse.success("Item 작성 성공");
        } catch (Exception e) {
            log.error("판매글 DB 저장 실패! 원인: ", e);
            throw new RuntimeException("DB 저장 중 알 수 없는 오류 발생", e);
        }
    }

    public ApiResponse<ItemListResponse> getPostById(Integer id) {

        Items entity = itemsRespository.findById(id)
                .orElseThrow(() -> new RuntimeException("글을 찾지 못했어요. ID: " + id));

        entity.setViews(entity.getViews() + 1);

        String categoryName = entity.getCategory().getName();

//        Notices prevEntityOpt = itemsRespository.findPrevNotice(id).orElse(null);
//        Notices nextEntityOpt = noticeRepository.findNextNotice(postId).orElse(null);
//        Notices prevEntity = noticeRepository.findPrevNotice(postId).orElse(null);
//        Notices nextEntity = noticeRepository.findNextNotice(postId).orElse(null);

        ItemListResponse response = ItemListResponse.of(entity, categoryName);

        return ApiResponse.success("글 가져옴", response);
    }

    public ApiResponse<?> deleteItemById(Integer itemId, String currentId) {
        Items entity = itemsRespository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("삭제할 글을 찾지 못했습니다. ID: " + itemId));
        if (!entity.getUserId().equals(currentId)) {
            log.warn("권한 없는 삭제 시도. Item ID: {}, 소유자: {}, 요청자: {}",
                    itemId, entity.getUserId(), currentId);
            throw new RuntimeException("삭제 권한이 없습니다.");
        }
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
                log.error("판매글 ID {}의 이미지 파일 삭제 중 오류 발생: {}", itemId, e.getMessage());
            }
        }
        itemsRespository.delete(entity);
        log.info("아이템 DB 삭제 완료: ID {}", itemId);

        return ApiResponse.success("아이템 및 관련 파일 삭제 성공");
    }

    public ApiResponse<?> editItemById(Integer id, MarketEditRequest marketEditRequest, String currentId) {
        Items entity = itemsRespository.findById(id)
                .orElseThrow(() -> new RuntimeException("판매글이 없습니다."));

        if (!entity.getUserId().equals(currentId)) {
            log.warn("권한 없는 수정 시도. Item ID: {}, 소유자: {}, 요청자: {}",
                    id, entity.getUserId(), currentId);
            throw new RuntimeException("수정 권한이 없습니다.");
        }

        Set<String> oldFiles = extractFileNamesFromContent(entity.getContent());

        String unsafeContent = marketEditRequest.getContent();
        String semiSafeContent = Jsoup.clean(unsafeContent, getCustomSafelist());
        String safeContent = applyCssWhitelistFiltering(semiSafeContent);

        Set<String> newFiles = extractFileNamesFromContent(safeContent);

        oldFiles.removeAll(newFiles); // oldFiles 셋에서 newFiles에 포함된 요소 제거

        if (!oldFiles.isEmpty()) {
            deleteFiles(oldFiles);
        }

        entity.setTitle(marketEditRequest.getTitle());
        entity.setContent(safeContent);
        entity.setCategoryId(marketEditRequest.getCategory());
        entity.setPrice(marketEditRequest.getPrice());

        entity.setThumbnailUrl(extractFirstImageUrl(safeContent));


        log.info("판매글 수정 완료 ID: {}", id);
        return ApiResponse.success("판매글이 성공적으로 수정되었습니다.");
    }

    public ApiResponse<?> buyItemWrite(ItemBuyRequest request, String userId) {
        try {Comments entity = Comments.builder()
                .userId(userId)
                .itemId(request.getItemId())
                .nickname(request.getNickname())
                .price(request.getPrice())
                .txt(request.getTxt())
                .build();

        commentsRepository.save(entity);
        return ApiResponse.success("comment 작성 성공");
        }catch (Exception e) {
            log.error("comment DB 저장 실패! 원인: ", e);
            throw new RuntimeException("DB 저장 중 알 수 없는 오류 발생", e);
        }
    }

    public ApiResponse<?> getCommentList(Integer id) {
        List<Comments> commentList = commentsRepository.findByItemId(id);
        List<CommentListResponse> dtoList = commentList.stream()
                .map(CommentListResponse::new)
                .collect(Collectors.toList());

        return ApiResponse.success("성공", dtoList);
    }

    public ApiResponse<?> deleteCommentById(Integer id, String userId) {
        log.info("삭제들어오는지");
        Comments entity = commentsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("삭제할 댓글을 찾지 못했습니다. ID: " + id));
        if (!entity.getUserId().equals(userId)) {
            log.warn("권한 없는 삭제 시도. Item ID: {}, 소유자: {}, 요청자: {}",
                    id, entity.getUserId(), userId);
            throw new RuntimeException("삭제 권한이 없습니다.");
        }

        commentsRepository.delete(entity);
        log.info("댓글 삭제 성공");

        return ApiResponse.success("댓글 삭제 성공");

    }

    public ApiResponse<?> acceptDeal(Integer id, String userId) {
        int affectedRows = itemsRespository.updateStatusToSoldOut(id, userId);

        if (affectedRows > 0) {
            return ApiResponse.success("거래 수락 완료", null);
        } else {

            if (!itemsRespository.existsById(id)) {
                return ApiResponse.error("404", "해당 판매글을 찾을 수 없습니다.");
            } else {
                // 게시글은 있지만, 업데이트가 안 됐다는 것은 userId가 다르다는 뜻입니다.
                return ApiResponse.error("403", "판매글 작성자만 거래를 수락할 수 있습니다.");
            }
        }
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
                        element.removeAttr("style");
                    } else {
                        element.attr("style", filteredStyle);
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
                    safeCss.append(property).append(": ").append(value).append("; ");
                }
            }
            return safeCss.toString().trim();
        }
    }
}