import { Link, useNavigate } from "react-router-dom";
import '../assets/styles/header.css'
import { AlertCircle, LogOut, User2, User2Icon, UserPlus2 } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { apiSignOut } from "../api/userApi";
import axios from "axios";
const Header = () => {
    const authUser = useAuthStore((s: any) => s.authUser);
    const signOut = useAuthStore((s: any) => s.signout);
    // console.log(authUser);

    const navigate = useNavigate();
    const handleSignOut = async () => {
        if (!authUser) return;
        try {
            // api 요청
            console.log(authUser.id + "아이디 확인");

            const response = await apiSignOut({ id: authUser.id });
            // alert(JSON.stringify(response));
            if (response.result === 'success') {
                signOut();
                sessionStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            if (axios.isAxiosError(error) && error.response?.data) {
                const errorCode = error.response.data.errorCode;
                if (errorCode === "FAILED_SIGNOUT") {
                    alert(error.response?.data?.message ?? error.message);
                };
            } else {
                alert("예상치 못한 에러가 발생했습니다");
            }
        }
    };
    return (
        <header>
            <div className="header-left">
                <Link to="/" className="logo-link">
                    <img src="/images/second-logo.png" width="187px" height="47px" alt="로고" />
                </Link>
                <ul className="nav-list">
                    <li className="nav-list-left-item">공지사항</li>
                    <li className="nav-list-left-item">장터</li>
                    <li className="nav-list-left-item">더알아보기</li>
                </ul>
            </div>
            <div>
                <ul className="nav-list">
                    <AlertCircle />
                    {!authUser && (
                        <><Link to="/signin"><li className="nav-list-item"><User2 /></li></Link><Link to="/signup"><li className="nav-list-item"><UserPlus2 /></li></Link></>
                    )}
                    {authUser && (
                        <>

                            <li className="nav-list-item"><User2Icon /></li>
                            <li className="nav-list-item"><LogOut onClick={handleSignOut} /></li>
                        </>
                    )}
                </ul>
            </div>
        </header>
    );
};

export default Header;