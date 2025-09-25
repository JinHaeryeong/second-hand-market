import { devtools } from "zustand/middleware";
import { create } from "zustand";
// authStore.js
interface AuthState {
    authUser: {
        name: string;
        email: string;
        nickName: string;
        id: string;
        role: string;
        accessToken: string;
        refreshToken: string;
    } | null;
    signInAuthUser: (user: AuthState['authUser']) => void;
    signout: () => void;
}
export const useAuthStore = create<AuthState>()(
    devtools((set) => ({
        authUser: null, // 인증받은 사용자 정보 초기값
        // 사용자 정보를 받아 authUser 상태를 업데이트하는 액션
        signInAuthUser: (user) =>
            set({
                authUser: user,
            }),
        // 로그아웃 시 authUser를 null로 설정하는 액션
        signout: () =>
            set({
                authUser: null,
            }),
    }))
);

