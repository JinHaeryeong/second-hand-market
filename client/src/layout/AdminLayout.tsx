import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useEffect } from 'react';
import Side from '../components/Side';
import "../assets/styles/admin.css";
const AdminLayout = () => {
    const authUser = useAuthStore((s: any) => s.authUser);
    const navigate = useNavigate();
    useEffect(() => {
        if (!authUser || authUser.role !== "ROLE_ADMIN") {
            alert("접근 권한이 없습니다.");
            navigate("/");
        }
    }, [authUser]);
    if (!authUser) {
        return <div className="admin-loading">관리자 권한 확인 중...</div>;
    }
    return (
        <div className="admin-layout-container">
            <Side />
            <div className="admin-content-area"> {/* Outlet 영역 분리 */}
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;