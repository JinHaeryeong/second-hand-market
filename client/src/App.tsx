import './assets/styles/global.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home'
import SignUp from './components/member/SignUp';
import SignIn from './components/member/SignIn';
import Notices from './pages/Notices';
import NoticeWrite from './components/notices/NoticeWrite';
import Notice from './pages/Notice';
import NoticeEdit from './components/notices/NoticeEdit';
import Member from './pages/Member';
import DefaultLayout from './layout/DefaultLayout';
import AdminLayout from './layout/AdminLayout';
import MemberList from './components/member/MemberList';

function App() {
  // const signInAuthUser = useAuthStore((s) => s.signInAuthUser);
  // useEffect(() => {
  //   requestAuthUser();
  // }, [signInAuthUser]);

  // const requestAuthUser = async () => {
  //   try {
  //     const accessToken = sessionStorage.getItem("accessToken");
  //     // console.log(accessToken);


  //     if (accessToken) {
  //       const response = await axiosAuthInstance.get(`/auth/user`, {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       });
  //       const authUser = await response.data;
  //       // alert(JSON.stringify(authUser));
  //       console.log("App.tsx의 authUser" + authUser.name);

  //       signInAuthUser(authUser); //인증사용자 정보 전역 state에 설정 후 로딩 상태 false
  //     }
  //   } catch (error) {
  //     console.error("accessToken이 유효하지 않음", error);
  //     alert(error);
  //     sessionStorage.removeItem("accessToken");
  //     localStorage.removeItem("refreshToken");
  //   }
  // };
  return (
    <div className="container">
      <BrowserRouter>

        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path='/' element={<Home />} />
            <Route path='/admin' element={<SignIn loginType="admin" />} />
            <Route path="/signIn" element={<SignIn loginType="user" />} />
            <Route path='/signUp' element={<SignUp />} />
            <Route path='/notices' element={<Notices />} />
            <Route path='/notice/:id' element={<Notice />} />
            <Route path='/notice/edit/:id' element={<NoticeEdit />} />
            <Route path='/noticeWrite' element={<NoticeWrite />} />
            <Route path='/market' />
            <Route path='/about' />
          </Route>
          <Route path='/admin/dashboard' element={<AdminLayout />}>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
