// // axiosAuthInstance.js
// // 사용자 인증이나 인가가 필요한 api요청시 사용
// import axios from "axios";
// ; import { checkTokenExpiration, refreshAccessToken } from "../utils/authUtils";

// const axiosAuthInstance = axios.create({
//     baseURL: `http://localhost:8080/api`,
//     headers: {
//         "Content-Type": "application/json",
//     },
// });
// export default axiosAuthInstance;

// //인터셉터 (interceptor) : 요청을 서버로 보내기 직전에 실행되어 요청 내용을 검증하거나 조작하거나 하는 일을 수행
// //[1] 요청 인터셉터  : 요청 보내기 전에 사전처리
// //[2] 응답 인터셉터 : 서버로부터 응답을 받았을 때 브라우저에 출력하기 전에 그 응답을 가로채서 처리하는 역할 수행

// // [1] 요청 인터셉터
// axiosAuthInstance.interceptors.request.use(
//     async (config) => {
//         // config => 요청 설정 객체
//         // accessToken을 sessionStorage에서 꺼내서 유효한 토큰인지 체크
//         const accessToken = sessionStorage.getItem("accessToken");
//         // console.log("요청 인터셉터 실행중..accessToken: " + accessToken);
//         if (accessToken) {
//             // 유효한 토큰인지 체크
//             if (checkTokenExpiration(accessToken)) {
//                 console.log(`요청 인터셉터: 유효하지 않은 토큰인 경우`);

//                 // 유효하지 않은 토큰이면 true
//                 // [1] 유효하지 않은 경우=> refreshToken을 서버에 보내서 새로운 accessToken 발급받자
//                 const newAccessToken = await refreshAccessToken();
//                 // console.log(`새 액세스 토큰 받음: ${newAccessToken}`);
//                 if (newAccessToken) {
//                     sessionStorage.setItem("accessToken", newAccessToken);
//                     config.headers["Authorization"] = `Bearer ${newAccessToken}`;
//                     return config;
//                 }
//                 return config;
//             } //if-------
//             // [2] 유효한 경우라면
//             config.headers["Authorization"] = `Bearer ${accessToken}`;
//         }
//         return config; //config를 반환하지 않으면 요청이 진행되지 않거나 에러 발생
//     },
//     (err) => {
//         console.error("요청 인터셉터 에러", err);
//         Promise.reject(err);
//     }
// );

// // [2] 응답 인터셉터
// axiosAuthInstance.interceptors.response.use(
//     (res) => res,
//     async (err) => {
//         const status = err.response?.status;
//         // console.log(`응답 인터셉터에서 받은 status: ${status}`);
//         if (status === 400) {
//             // 사용자가 값 안넘긴 경우
//             alert(err.response.data?.message);
//             window.location.href = "/";
//             return Promise.reject(err);
//         }
//         if (status === 401) {
//             // unauthorized 인증받지 않은 사용자인 경우 => refreshToken보내서 새 액세스 토큰 받기
//             try {
//                 const newAccessToken = await refreshAccessToken();
//                 // console.log(`새 액세스 토큰 받음: ${newAccessToken}`);
//                 if (newAccessToken) {
//                     sessionStorage.setItem("accessToken", newAccessToken);
//                     err.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
//                     return axiosAuthInstance(err.config); //원래 요청 재시도
//                 } ///////////////////
//             } catch (error) {
//                 console.error(error); //리프레시 토큰이 유효하지 않은 경우
//             }
//             localStorage.removeItem("refreshToken");
//             localStorage.removeItem("authUser");
//             sessionStorage.removeItem("accessToken");
//             sessionStorage.removeItem("authUser");
//             window.location.href = "/";
//             return Promise.reject(err);
//         }
//         if (status === 403) {
//             // 인가받지 않은 사용자인 경우 (권한이 없는 경우)
//             alert("접근 권한이 없습니다.");
//             window.location.href = "/";
//             return Promise.reject(err);
//         }
//     }
// );
import axios from "axios";
import { checkTokenExpiration, refreshAccessToken } from "../utils/authUtils";

const axiosAuthInstance = axios.create({
    baseURL: `http://localhost:8080/api`,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosAuthInstance;

// [1] 요청 인터셉터: 토큰 추가 및 만료 시 갱신 시도
axiosAuthInstance.interceptors.request.use(
    async (config) => {
        const accessToken = sessionStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (accessToken) {
            // 1. 토큰이 존재하면 일단 헤더에 설정 (만료 여부와 무관)
            config.headers["Authorization"] = `Bearer ${accessToken}`;

            // 2. 만료 여부 체크 (checkTokenExpiration이 만료 시 true를 반환한다고 가정)
            if (checkTokenExpiration(accessToken)) {
                console.log(`요청 인터셉터: 만료 토큰 감지. 갱신 시도.`);

                if (refreshToken) {
                    try {
                        const newAccessToken = await refreshAccessToken();
                        if (newAccessToken) {
                            sessionStorage.setItem("accessToken", newAccessToken);
                            // 3. 새 토큰으로 헤더 교체
                            config.headers["Authorization"] = `Bearer ${newAccessToken}`;
                        }
                    } catch (error) {
                        // 4. 리프레시 실패 시 (RefreshToken 만료/오류)
                        console.error("액세스 토큰 갱신 실패. 강제 로그아웃 처리.");
                        // 강제 로그아웃 처리는 응답 인터셉터 401 로직과 동일하게 수행하거나,
                        // 여기서 Promise.reject를 통해 401/403을 유발하여 응답 인터셉터로 넘깁니다.
                        return Promise.reject(error);
                    }
                } else {
                    // RefreshToken 자체가 없으면 로그인 페이지로 이동
                    window.location.href = "/";
                    return Promise.reject(new Error("리프레시 토큰이 없습니다."));
                }
            }
        }
        return config;
    },
    (err) => {
        console.error("요청 인터셉터 에러", err);
        return Promise.reject(err);
    }
);

// [2] 응답 인터셉터: 상태 코드별 처리
axiosAuthInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
        const status = err.response?.status;
        const originalRequest = err.config;

        if (status === 400) {
            alert(err.response.data?.message);
            window.location.href = "/";
            return Promise.reject(err);
        }

        // 401 Unauthorized 처리 (토큰 만료 시 서버가 401을 반환하도록 백엔드 수정 필요)
        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // 재시도 플래그 설정

            try {
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    sessionStorage.setItem("accessToken", newAccessToken);
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    return axiosAuthInstance(originalRequest); // 원래 요청 재시도
                }
            } catch (error) {
                console.error("리프레시 토큰이 유효하지 않아 로그아웃 처리됨.", error);
            }

            // 리프레시 실패 시: 세션/로컬 스토리지 정리 후 리다이렉트
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("authUser");
            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("authUser");
            window.location.href = "/";
            return Promise.reject(err);
        }

        if (status === 403) {
            // 인가받지 않은 사용자 (권한이 없는 경우: ROLE_ADMIN 미보유)
            alert("접근 권한이 없습니다.");
            window.location.href = "/";
            return Promise.reject(err);
        }
        return Promise.reject(err);
    }
);