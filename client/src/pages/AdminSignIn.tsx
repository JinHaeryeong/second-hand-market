import { useRef, useState } from "react";
import '../assets/styles/sign-In.css'
const AdminSignIn = () => {
    const [admin, setAdmin] = useState({
        id: "", pwd: ""
    });

    const idRef = useRef<HTMLInputElement | null>(null);
    const pwdRef = useRef<HTMLInputElement | null>(null);

    const handleChange = (e: any) => {
        setAdmin({ ...admin, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e: any) => {
        e.preventDefault();
        const { id, pwd } = admin;
        if (!id.trim()) {
            alert("아이디를 입력하세요.");
            idRef.current?.focus();
        }
        if (!pwd.trim()) {
            alert("비밀번호를 입력하세요.");
            pwdRef.current?.focus();
        }


    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="id">아이디</label>
                <input type="text" placeholder="아이디" id="id" name="id" ref={idRef} value={admin.id} onChange={handleChange} />
                <label htmlFor="pwd">비밀번호</label>
                <input type="password" placeholder="비밀번호" id="pwd" name="pwd" ref={pwdRef} value={admin.pwd} onChange={handleChange} />
                <button className="admin-sign-in-btn">로그인</button>
            </form>
        </div>
    );
}

export default AdminSignIn;