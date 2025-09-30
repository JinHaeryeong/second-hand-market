import axios from "axios";
import { useRef, useState } from "react";
import "../../assets/styles/sign.css"
import { useNavigate } from "react-router-dom";
import { apiSignUp } from "../../api/userApi";
const SignUp = () => {
    const [signUpInput, setSignUpInput] = useState({
        name: "",
        nickname: "",
        id: "",
        email: "",
        pwd: "",
        pwdCheck: "",
        city: "",
        age: "",
    });
    const currentYear = new Date().getFullYear();
    const startYear = 1910;

    const years = [];
    for (let year = currentYear; year >= startYear; year--) {
        years.push(year);
    }


    let idRef = useRef<HTMLInputElement | null>(null);
    let nameRef = useRef<HTMLInputElement | null>(null);
    let nicknameRef = useRef<HTMLInputElement | null>(null);
    let emailRef = useRef<HTMLInputElement | null>(null);
    let passwdRef = useRef<HTMLInputElement | null>(null);
    let cityRef = useRef<HTMLSelectElement | null>(null);
    let passwdCheckRef = useRef<HTMLInputElement | null>(null);
    let ageRef = useRef<HTMLInputElement | null>(null);

    const navigate = useNavigate();
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setSignUpInput((prev) => ({ ...prev, [name]: value }));
    };

    const check = () => {
        const { name, id, pwd, city, pwdCheck, age } = signUpInput;
        // 유효성 체크. 입력 포커스 주기
        if (!name.trim()) {
            alert("이름을 입력하세요");
            nameRef.current?.focus();
            return false;
        }
        if (!id.trim()) {
            //정규식 이용해서 이메일 형식 맞는지 체크
            alert("이메일 입력하세요");
            idRef.current?.focus();
            return false;
        }
        if (!pwd.trim()) {
            //정규식 이용해서 이메일 형식 맞는지 체크
            alert("비밀번호 입력하세요");
            passwdRef.current?.focus();
            return false;
        }
        if (!pwdCheck.trim()) {
            //정규식 이용해서  비밀번호 맞는지 체크
            alert("비밀번호 확인을 입력하세요");
            passwdCheckRef.current?.focus();
            return false;
        }
        if (pwd.trim() !== pwdCheck.trim()) {
            alert("입력된 비밀번호가 다릅니다. 다시 확인해주세요");
            passwdCheckRef.current?.focus();
            return false;
        }
        if (!city.trim()) {
            alert("지역을 입력하세요");
            cityRef.current?.focus();
            return false;
        }
        if (!age.trim()) {
            //정규식 이용해서 이메일 형식 맞는지 체크
            alert("출생년도를 입력하세요");
            ageRef.current?.focus();
            return false;
        }
        return true;
    };
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const b = check();
        if (!b) return;
        requestSignUp();
    };

    const resetForm = () => {
        setSignUpInput({ name: "", nickname: "", id: "", email: "", pwd: "", pwdCheck: "", city: "", age: "" });
        nameRef.current?.focus();
    };
    const requestSignUp = async () => {
        try {
            const response = await apiSignUp(signUpInput);
            const { result, message } = response;
            console.log("회원가입 응담:");
            if (result === "success") {
                alert("회원가입을 완료하였습니다.");
                navigate("/");
            } else {
                alert(message);
            }
            resetForm();
            navigate("/");
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                const errorCode = error.response.data.errorCode;
                if (errorCode === "DUPLICATE_USERID") {
                    alert("이미 사용 중인 아이디입니다.");
                } else if (errorCode === "DUPLICATE_EMAIL") {
                    alert("이미 사용 중인 이메일입니다.");
                } else if (errorCode === "DUPLICATE_NICKNAME") {
                    alert("이미 사용 중인 닉네임입니다.");
                }
                else {
                    alert(error.response.data.message);
                }
            } else {
                alert("예상치 못한 에러가 발생했습니다");
            }
        }
    }

    return (
        <div className='signup'>
            <div className='signup-top'>
                <h1>회원가입</h1>
                <img src='/images/main.png' alt='로고' />
                <div>중고 거래를 손쉽게</div>
            </div>
            <form className='signup-form' onSubmit={handleSubmit}>
                <div className='signup-form-item'>
                    <label htmlFor='name'>이름</label>
                    <input
                        type='text'
                        name='name'
                        id='name'
                        value={signUpInput.name}
                        placeholder='이름을 입력해주세요'
                        ref={nameRef}
                        onChange={handleChange}
                    />
                </div>
                <div className='signup-form-item'>
                    <label htmlFor='id'>아이디</label>
                    <input
                        type='text'
                        name='id'
                        id='id'
                        value={signUpInput.id}
                        placeholder='아이디를 입력해주세요'
                        ref={idRef}
                        onChange={handleChange}
                    />
                </div>
                <div className='signup-form-item'>
                    <label htmlFor='email'>이메일</label>
                    <input
                        type='email'
                        name='email'
                        id='email'
                        value={signUpInput.email}
                        placeholder='이메일을 입력해주세요'
                        ref={emailRef}
                        onChange={handleChange}
                    />
                </div>
                <div className='signup-form-item'>
                    <label htmlFor='nickname'>닉네임</label>
                    <input
                        type='text'
                        name='nickname'
                        id='nickname'
                        value={signUpInput.nickname}
                        placeholder='닉네임을 입력해주세요'
                        ref={nicknameRef}
                        onChange={handleChange}
                    />
                </div>
                <div className='signup-form-item'>
                    <label htmlFor='pwd'>비밀번호</label>
                    <input
                        type='password'
                        name='pwd'
                        id='pwd'
                        value={signUpInput.pwd}
                        placeholder='비밀번호를 입력해주세요'
                        ref={passwdRef}
                        onChange={handleChange}
                    />
                </div>
                <div className='signup-form-item'>
                    <label htmlFor='pwdCheck'>비밀번호 확인</label>
                    <input
                        type='password'
                        name='pwdCheck'
                        id='pwdCheck'
                        value={signUpInput.pwdCheck}
                        placeholder='입력한 비밀번호를 다시 입력해주세요'
                        ref={passwdCheckRef}
                        onChange={handleChange}
                    />
                </div>
                <div className='signup-form-item'>
                    <label htmlFor="city">지역</label>
                    <select
                        ref={cityRef}
                        id="city"
                        name="city"
                        value={signUpInput.city} // 현재 상태 값과 연결
                        onChange={handleChange} // 값이 변경될 때 상태 업데이트
                    >
                        <option value="">-- 지역 선택 --</option>
                        <option value="서울">서울</option>
                        <option value="경기">경기</option>
                        <option value="부산">부산</option>
                        <option value="대구">대구</option>
                        <option value="인천">인천</option>
                    </select>
                </div>
                <div className='signup-form-item'>
                    <label htmlFor='age'>나이</label>
                    <select
                        id="age"
                        name="age"
                        value={signUpInput.age}
                        onChange={handleChange}
                    >
                        <option value="">-- 출생년도 선택 --</option>
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}년
                            </option>
                        ))}
                    </select>
                </div>

                <button className='signup-form-submit-btn'>가입하기</button>
            </form>
        </div>
    );
}

export default SignUp;