<p align="center">
<img width="478" height="87" alt="main" src="https://github.com/user-attachments/assets/60bc2f22-6801-4830-9581-8350004fda85" />
</p>



---

## 📝 프로젝트 개요
- 📌 목표:
React, Spring Boot와 MySQL을 활용하여 중고거래 사이트를 제작. 간단한 장터글 작성부터 채팅 기능, 관리자 페이지 등이 제공됩니다
## 개발 기간
2025.09.22 - 2025.10.02
### 🛠️ **사용 기술**:
- React 19.1.1v (클라이언트)
- Spring Boot 3.5.6v(서버)
- MySQL(데이터베이스)
### 👉 **환경**
- Window 11 Home
- Visual Studio Code
- AMD Ryzen 7 7735HS with Radeon Graphics
- Ram 32GB

---

## 📁 프로젝트 구조
클라이언트
```
📦src
 ┣ 📂api
 ┃ ┣ 📜adminApi.ts
 ┃ ┣ 📜axiosAuthInstance.ts
 ┃ ┣ 📜axiosInstance.ts
 ┃ ┣ 📜chatApi.ts
 ┃ ┣ 📜marketApi.ts
 ┃ ┣ 📜noticeApi.ts
 ┃ ┗ 📜userApi.ts
 ┣ 📂assets
 ┃ ┣ 📂styles
 ┃ ┃ ┣ 📜about.css
 ┃ ┃ ┣ 📜admin.css
 ┃ ┃ ┣ 📜chat.css
 ┃ ┃ ┣ 📜footer.css
 ┃ ┃ ┣ 📜global.css
 ┃ ┃ ┣ 📜header.css
 ┃ ┃ ┣ 📜home.css
 ┃ ┃ ┣ 📜market.css
 ┃ ┃ ┣ 📜member.css
 ┃ ┃ ┣ 📜notices.css
 ┃ ┃ ┣ 📜side.css
 ┃ ┃ ┣ 📜sign-In.css
 ┃ ┃ ┗ 📜sign.css
 ┃ ┗ 📜react.svg
 ┣ 📂components
 ┃ ┣ 📂admin
 ┃ ┃ ┣ 📜DashBoard.tsx
 ┃ ┃ ┣ 📜ItemList.tsx
 ┃ ┃ ┗ 📜MemberList.tsx
 ┃ ┣ 📂market
 ┃ ┃ ┣ 📜MarketCommentList.tsx
 ┃ ┃ ┣ 📜MarketComments.tsx
 ┃ ┃ ┣ 📜MarketItemDetail.tsx
 ┃ ┃ ┣ 📜MarketItemEdit.tsx
 ┃ ┃ ┣ 📜MarketItems.tsx
 ┃ ┃ ┣ 📜MarketItemsSearch.tsx
 ┃ ┃ ┗ 📜MarketItemWrite.tsx
 ┃ ┣ 📂member
 ┃ ┃ ┣ 📜SignIn.tsx
 ┃ ┃ ┗ 📜SignUp.tsx
 ┃ ┣ 📂notices
 ┃ ┃ ┣ 📜NoticeDetail.tsx
 ┃ ┃ ┣ 📜NoticeEdit.tsx
 ┃ ┃ ┣ 📜NoticeList.tsx
 ┃ ┃ ┗ 📜NoticeWrite.tsx
 ┃ ┣ 📜ChatListPopover.tsx
 ┃ ┣ 📜ChatRoomModal.tsx
 ┃ ┣ 📜Footer.tsx
 ┃ ┣ 📜Header.tsx
 ┃ ┣ 📜MainMiddle.tsx
 ┃ ┣ 📜MainTop.tsx
 ┃ ┣ 📜modal.tsx
 ┃ ┗ 📜Side.tsx
 ┣ 📂layout
 ┃ ┣ 📜AdminLayout.tsx
 ┃ ┗ 📜DefaultLayout.tsx
 ┣ 📂pages
 ┃ ┣ 📜About.tsx
 ┃ ┣ 📜AdminSignIn.tsx
 ┃ ┣ 📜Home.tsx
 ┃ ┣ 📜Market.tsx
 ┃ ┣ 📜Member.tsx
 ┃ ┣ 📜Notice.tsx
 ┃ ┗ 📜Notices.tsx
 ┣ 📂stores
 ┃ ┣ 📜authStore.ts
 ┃ ┣ 📜marketStore.ts
 ┃ ┗ 📜postStore.ts
 ┣ 📂utils
 ┃ ┗ 📜authUtils.ts
 ┣ 📜App.css
 ┣ 📜App.tsx
 ┣ 📜index.css
 ┣ 📜main.tsx
 ┗ 📜vite-env.d.ts
```
서버
```
📦src
 ┣ 📂main
 ┃ ┣ 📂java
 ┃ ┃ ┗ 📂com
 ┃ ┃ ┃ ┗ 📂example
 ┃ ┃ ┃ ┃ ┗ 📂project
 ┃ ┃ ┃ ┃ ┃ ┣ 📂chat
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜ChatRoomController.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜StompController.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜ChatDto.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜ChatRoomRequest.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜ChatRoomResponse.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂Entity
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜ChatMessage.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜ChatRoom.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜RoomType.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂repository
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜ChatRepository.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜ChatRoomRepository.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂service
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜ChatService.java
 ┃ ┃ ┃ ┃ ┃ ┣ 📂exception
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜DuplicateEmailException.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜DuplicateNicknameException.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜DuplicateUserIdException.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜GlobalExceptionHandler.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜ValidationException.java
 ┃ ┃ ┃ ┃ ┃ ┣ 📂filter
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜JwtFilter.java
 ┃ ┃ ┃ ┃ ┃ ┣ 📂post
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜FileController.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜MarketController.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜NoticeController.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂domain
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜CommentListResponse.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜ItemBuyRequest.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜ItemListResponse.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜MarketEditRequest.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜MarketWriteRequest.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜NoticeDetailResponse.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜NoticeEditRequest.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜NoticesListRequest.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜NoticeWriteRequest.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂entity
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜Category.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜Comments.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜Items.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜Notices.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂repository
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜CommentsRepository.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜ItemsRespository.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜NoticeRepository.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂service
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜MarketService.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜NoticeService.java
 ┃ ┃ ┃ ┃ ┃ ┣ 📂user
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜AdminController.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜UserController.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂domain
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜ApiResponse.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜ResponseRequest.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜SignInRequest.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜SignInResponse.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜SignUpRequest.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜UsersResponse.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂entity
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜Member.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜Role.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂repository
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜MemberRepository.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂service
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜AdminService.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜UserDetailsServiceImpl.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜UserService.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂util
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜JwtUtil.java
 ┃ ┃ ┃ ┃ ┃ ┣ 📜ProjectApplication.java
 ┃ ┃ ┃ ┃ ┃ ┣ 📜WebConfig.java
 ┃ ┃ ┃ ┃ ┃ ┣ 📜WebSecurityAndJwtConfig.java
 ┃ ┃ ┃ ┃ ┃ ┗ 📜WebSocketBrokerConfig.java
 ┃ ┗ 📂resources
 ┃ ┃ ┣ 📂static
 ┃ ┃ ┣ 📂templates
 ┃ ┃ ┣ 📜application-dev.yml
 ┃ ┃ ┗ 📜application.yml
 ┗ 📂test
 ┃ ┗ 📂java
 ┃ ┃ ┗ 📂com
 ┃ ┃ ┃ ┗ 📂example
 ┃ ┃ ┃ ┃ ┗ 📂project
 ┃ ┃ ┃ ┃ ┃ ┗ 📜ProjectApplicationTests.java
```

---
## ▶ 실행 방법

### 1. Node.js 설치
https://nodejs.org/en/blog/release/v22.18.0


### 2. 패키지 설치
> node i 명령어를 통해 package.json의 의존성 설치
- cd client > npm i

### 3. 실행
- Visual Studio Code를 통해 실행(클라이언트)
- 프로젝트 폴더 진입 후 터미널
- cd client > npm run dev

- IntelliJ 등의 IDE를 통해 실행(서버)

---

## 🔍결과(수정중)



|       컴포넌트명       | 화면          |
| ------------------ | -------------- |
| 홈 | ![메인페이지](https://github.com/user-attachments/assets/88c3a9af-4585-4935-9475-ac62c10c3923)|
| 공지사항 |![공지사항](https://github.com/user-attachments/assets/b47c750c-83e0-44cf-ae76-a2b41414a0aa)|
| 공지사항 상세페이지 |![공지사항 상세페이지](https://github.com/user-attachments/assets/d2799e7d-e571-48d2-a9dc-5fa3863ea339)|
| 장터 | ![장터](https://github.com/user-attachments/assets/5b3da858-4071-47c1-a382-4adf9cee80e8)|
| 장터 상세보기 | ![장터 상세보기](https://github.com/user-attachments/assets/1cee23f0-09a9-44d2-b952-0c6d802eb3cd)|
| 판매글 수정 | ![판매글 수정](https://github.com/user-attachments/assets/d8705371-82a4-4444-8880-5d1d40ff4451)|
| 가격 제시 | ![가격 제시](https://github.com/user-attachments/assets/7b59d9f4-3d6e-428a-bb73-ac0cf07a6cf9)|
| 판매글(판매자 화면) | ![판매자 화면](https://github.com/user-attachments/assets/8b3ea9ab-ffb9-4209-8120-43825971c0ec)|





---
## 🧩 구현 내용 요약
- JWT를 이용해 로그인, 로그아웃 구현
- 관리자 페이지를 통해 유저 및 상품 관리 기능 구현
- 장터에 게시된 물품에 대해 가격 제시 기능 구현
- 물품 게시글에서 판매자에게 채팅 기능 구현
---


