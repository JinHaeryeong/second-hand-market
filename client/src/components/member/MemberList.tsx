import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useEffect, useState } from "react";

const MemberList = () => {
    const authUser = useAuthStore((s: any) => s.authUser);
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!authUser || authUser.role !== "ROLE_ADMIN") {
            alert("접근 권한이 없습니다.")
            navigate("/");
        }
    }, [authUser]);

    return (
        <div className="member-container">
            <h1>멤버</h1>
        </div>
    );
}

export default MemberList;