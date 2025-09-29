import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { create } from "zustand";

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
    // devtools를 persist 안에 넣어 두 기능 모두 사용
    persist(
        devtools((set) => ({
            authUser: null, // 초기값 설정

            signInAuthUser: (user) => set({ authUser: user }),

            signout: () => {
                set({ authUser: null });
                window.location.href = "/";
            },
        })),
        {
            name: "authUser", // 1. sessionStorage에 저장될 키 이름
            storage: createJSONStorage(() => sessionStorage), // 2. sessionStorage 사용
            partialize: (state) => ({ authUser: state.authUser }), // 3. authUser만 저장
        }
    )
);