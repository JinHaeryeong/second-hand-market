// authUtils.js
import axios from "axios";

export const checkTokenExpiration = (token: string) => {
    try {
        // header.payload.signature
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expTime = payload.exp * 1000; //exp: 유효시간 초단위

        return expTime < Date.now();
        // 1시까지  <  2시 => 유효시간이 지난 경우 => true
        // 3시까지  >  2시 => 유효시간이 남은 경우 => false
    } catch (error) {
        console.error("잘못된 토큰 포맷 에러: ", error);
        return true;
    }
};
// 리프레시 토큰으로 서버에 요청 보내기
export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
        console.log("refreshToken 없음");
        return null;
    }
    // 리프레시 토큰을 보내 새로운 서버에서 검증은 후 새 액세스토큰을 받자
    try {
        // const response = await axios.post(`http://localhost:8080/api/auth/refresh`, { refreshToken }); //Node.js 연동
        const response = await axios.post(
            `http://localhost:8080/api/auth/refresh`, //spring security jwt연동시
            { refreshToken }, // body
            {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
            }
        );
        const newAccessToken = await response.data?.accessToken;
        return newAccessToken;
    } catch (error) {
        console.error(`refreshToken error: ${error}`);
        return null;
    }
};
