import { useAuthStore } from "../../stores/authStore";
import "../../assets/styles/notices.css"
import { Link } from "react-router-dom";
const NoticeList = () => {
    const authUser = useAuthStore((s: any) => s.authUser);
    // console.log(authUser.id);

    return (
        <div className="notices-container">
            <h1>공지사항</h1>
            <div>
                {authUser && authUser.role === "ROLE_ADMIN" && (<Link to="/noticeWrite"><button className="notice-write-btn">글쓰기</button></Link>)}
            </div>
        </div>
    );
}

export default NoticeList;