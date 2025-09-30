import { useRef, useState } from "react";
import '../../assets/styles/sign.css';
import axios from "axios";
import { apiSignIn } from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { apiAdminSignIn } from "../../api/adminApi";
const SignIn = ({ loginType }: { loginType: string }) => {
    const [user, setUser] = useState({
        id: "", pwd: ""
    })
    const signInAuthUser = useAuthStore((s: any) => s.signInAuthUser);
    const idRef = useRef<HTMLInputElement | null>(null);
    const pwdRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    const handleChange = (e: any) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }
    const check = () => {
        const { id, pwd } = user;
        if (!id.trim()) {
            alert("아이디를 입력해주세요");
            idRef.current?.focus();
            return false;
        }
        if (!pwd.trim()) {
            alert("비밀번호를 입력해주세요.");
            pwdRef.current?.focus();
            return false;
        }
        return true;

    }
    const handleSubmit = (e: any) => {
        e.preventDefault();
        const b = check();
        if (!b) return;
        requestSignIn();
    }
    const requestSignIn = async () => {
        const apiCall = loginType === "user" ? apiSignIn : apiAdminSignIn;
        try {
            const response = await apiCall(user);
            const { result, message, data } = response;
            console.log("로그인 응답:" + data);
            if (result === "success") {
                alert("로그인을 완료하였습니다.");
                // const { accessToken, refreshToken } = data;
                // sessionStorage.setItem("accessToken", accessToken);
                // localStorage.setItem("refreshToken", refreshToken);
                // 회원정보(payload), 토큰...=> data를 store에 전달. 인증받은 사용자 => 전역 state로 관리하자
                signInAuthUser({ ...data });
                navigate("/");
            } else {
                alert(message);
            }
            resetForm();
            navigate("/");
        } catch (error) {
            console.error(error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message ?? error.message);
            } else {
                alert("예상치 못한 에러가 발생했습니다");
            }
            resetForm();
        }
    }
    const resetForm = () => {
        setUser({ id: "", pwd: "" });
    }
    return (
        <div className="sign-in-container">
            <h1>로그인</h1>
            <img src="/images/main.png" />
            <form onSubmit={handleSubmit} className="sigin-form">
                <div className="signin-form-item">
                    <label htmlFor="id" className="signin-label">아이디</label>
                    <input placeholder="아이디" type="text" value={user.id} onChange={handleChange} name="id" id="id" ref={idRef} />
                </div>
                <div className="signin-form-item">
                    <label htmlFor="pwd" className="signin-label">비밀번호</label>
                    <input placeholder="비밀번호" type="password" value={user.pwd} onChange={handleChange} name="pwd" id="pwd" ref={pwdRef} />
                </div>
                <div className="sign-form-bottom">
                    <ul className="sign-form-bottom-list">
                        <li className="sign-form-bottom-list-item">회원가입</li>
                        <li className="sign-form-bottom-list-item">아이디찾기</li>
                        <li className="sign-form-bottom-list-item">비밀번호찾기</li>
                    </ul>
                </div>
                <button className="sign-in-form-btn">로그인</button>
            </form>
        </div>
    );
}

export default SignIn;