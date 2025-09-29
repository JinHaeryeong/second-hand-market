import './assets/styles/global.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import SignUp from './components/member/SignUp';
import SignIn from './components/member/SignIn';
import Notices from './pages/Notices';
import NoticeWrite from './components/notices/NoticeWrite';
import Notice from './pages/Notice';
import NoticeEdit from './components/notices/NoticeEdit';
import DefaultLayout from './layout/DefaultLayout';
import AdminLayout from './layout/AdminLayout';
import MemberList from './components/admin/MemberList';
import DashBoard from './components/admin/DashBoard';
import ItemList from './components/admin/ItemList';
import Market from './pages/Market';
import MarketItemWrite from './components/market/MarketItemWrite';
import MarketItemDetail from './components/market/MarketItemDetail';
import MarketItemEdit from './components/market/MarketItemEdit';

function App() {

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
            <Route path='/market' element={<Market />} />
            <Route path='/market/:id' element={<MarketItemDetail />} />
            <Route path='/market/itemWrite' element={<MarketItemWrite />} />
            <Route path='/market/edit/:id' element={<MarketItemEdit />} />
            <Route path='/about' />
          </Route>
          <Route path='/admin-page' element={<AdminLayout />}>
            <Route index element={<DashBoard />} />
            <Route path='dashboard' element={<DashBoard />} />
            <Route path='users' element={<MemberList />} />
            <Route path='items' element={<ItemList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
