import './assets/styles/global.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home'
import AdminSignIn from './pages/AdminSignIn';
import SignUp from './components/member/SignUp';
import SignIn from './components/member/SignIn';
import { useAuthStore } from './stores/authStore';
import axiosAuthInstance from './api/axiosAuthInstance';
import { useEffect } from 'react';

function App() {
  const signInAuthUser = useAuthStore((s) => s.signInAuthUser);
  useEffect(() => {
    requestAuthUser();
  }, [signInAuthUser]);

  const requestAuthUser = async () => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      // console.log(accessToken);


      if (accessToken) {
        const response = await axiosAuthInstance.get(`/auth/user`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const authUser = await response.data;
        // alert(JSON.stringify(authUser));
        signInAuthUser(authUser); //인증사용자 정보 전역 state에 설정 후 로딩 상태 false
      }
    } catch (error) {
      console.error("accessToken이 유효하지 않음", error);
      alert(error);
      sessionStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  };
  return (
    <div className="container">
      <BrowserRouter>
        <Header />
        <hr className="nav-hr" />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/admin' element={<SignIn loginType="admin" />} />
          <Route path='/signUp' element={<SignUp />} />
          <Route path="/signIn" element={<SignIn loginType="user" />} />
        </Routes>
      </BrowserRouter>
      <hr />
      <Footer />
    </div>
  )
}

export default App
