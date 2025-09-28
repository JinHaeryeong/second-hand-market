
import axios from "axios";
import { checkTokenExpiration, refreshAccessToken } from "../utils/authUtils";
import { useAuthStore } from "../stores/authStore";

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
        const authStore = useAuthStore.getState();
        const accessToken = authStore.authUser?.accessToken;

        if (accessToken) {
            // 1. 토큰이 존재하면 일단 헤더에 설정 (만료 여부와 무관)
            config.headers["Authorization"] = `Bearer ${accessToken}`;

            // 2. 만료 여부 체크 (checkTokenExpiration이 만료 시 true를 반환한다고 가정)
            if (checkTokenExpiration(accessToken)) {
                console.log(`요청 인터셉터: 만료 토큰 감지. 갱신 시도.`);


                try {
                    const newAccessToken = await refreshAccessToken();
                    if (newAccessToken) {
                        // 갱신 성공: 새 토큰으로 헤더 교체
                        config.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    } else {
                        // 갱신 실패 (signout이 이미 실행됨)
                        return Promise.reject(new Error("토큰 갱신 실패로 요청 중단"));
                    }
                } catch (error) {
                    // 4. 리프레시 실패 시 (RefreshToken 만료/오류)
                    console.error("액세스 토큰 갱신 실패. 강제 로그아웃 처리.");
                    // 강제 로그아웃 처리는 응답 인터셉터 401 로직과 동일하게 수행하거나,
                    // 여기서 Promise.reject를 통해 401/403을 유발하여 응답 인터셉터로 넘깁니다.
                    return Promise.reject(error);
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

        if (status === 400 || status === 403) {
            // 400 (Bad Request) 또는 403 (Forbidden: 인가 실패)
            alert(err.response.data?.message || (status === 403 ? "접근 권한이 없습니다." : "잘못된 요청입니다."));
            window.location.href = "/";
            return Promise.reject(err);
        }

        // 401 Unauthorized 처리 (서버가 401을 보냈을 때의 방어 로직)
        if (status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // 1. 재발급 시도 (성공 시 Store 갱신)
                const newAccessToken = await refreshAccessToken();

                if (newAccessToken) {
                    // 2. 갱신 성공: 헤더 교체 및 원래 요청 재시도
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    return axiosAuthInstance(originalRequest);
                }
            } catch (error) {
                console.error("응답 인터셉터: 재발급 요청 중 오류 발생.", error);
            }

            // 3. 갱신 실패 확정: 강제 로그아웃
            // authUtils에서 signout이 이미 호출되었으므로, 리다이렉션만 수행
            window.location.href = "/";
            return Promise.reject(err);
        }

        return Promise.reject(err);
    }
);