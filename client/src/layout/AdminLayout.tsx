import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useEffect } from 'react';

const AdminLayout = () => {
    const authUser = useAuthStore((s: any) => s.authUser);
    const navigate = useNavigate();
    useEffect(() => {
        if (!authUser || authUser.role !== "ROLE_ADMIN") {
            alert("접근 권한이 없습니다.");
            navigate("/");
        }
    }, [authUser]);
    return (
        <div className="admin-layout-container">
            <Outlet />
        </div>
    );
};

export default AdminLayout;