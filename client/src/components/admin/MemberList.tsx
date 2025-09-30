import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useEffect, useState } from "react";
import { apiFetchUsers, apiUserDelete } from "../../api/adminApi";
import axios from "axios";
import { User2 } from "lucide-react";
import "../../assets/styles/member.css"
import Modal from "../modal";

const MemberList = () => {
    const authUser = useAuthStore((s: any) => s.authUser);
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isOpenMdoal, setIsModalOpen] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState("");
    useEffect(() => {
        if (!authUser || authUser.role !== "ROLE_ADMIN") {
            alert("접근 권한이 없습니다.")
            navigate("/");
        }
    }, [authUser]);

    useEffect(() => {
        requestUserList();
    }, [page]);
    const requestUserList = async () => {
        try {
            const response = await apiFetchUsers(page, 15, "");
            if (response.result === 'success' && response.data) {
                console.log("유저 목록 호출 성공" + response.data);
                console.log(response.data);
                setMembers(response.data.content);

            } else {
                alert("유저 목록을 호출하는데 실패했습니다.");
                return;
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                alert("목록 가져오기 실패: " + error.message);
            }
            return;
        }
    }

    const openDeleteInModal = (userId: string) => {
        setUserIdToDelete(userId);
        setIsModalOpen(true);
    };

    const closeDelteModal = () => {
        setIsModalOpen(false);
    };



    const handleDeleteUser = async () => {
        try {
            const response = await apiUserDelete(userIdToDelete);
            if (response.result === "success") {

                await requestUserList();
                alert("유저 삭제 성공");
            }
            else {
                alert("유저 삭제 실패");
            }
            closeDelteModal();
            return;

        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                alert("유저 삭제 실패: " + error.message);
            }
            closeDelteModal();
            return;
        }
    }
    return (
        <div className="member-container">
            <div className="member-board">
                <ul className="member-header">
                    <li>프로필</li>
                    <li>아이디</li>
                    <li>이름</li>
                    <li>닉네임</li>
                    <li>이메일</li>
                    <li>나이</li>
                    <li>사는곳</li>
                    <li>가입일</li>
                    <li>삭제</li>
                </ul>
                {members && (
                    members.map((member: any, index) => (
                        <ul key={index} className="member-list">
                            <li><div className="member-profile"><User2 /></div></li>
                            <li>{member.id}</li>
                            <li>{member.name}</li>
                            <li>{member.nickname}</li>
                            <li>{member.email}</li>
                            <li>{member.age}</li>
                            <li>{member.city}</li>
                            <li>{new Intl.DateTimeFormat('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            }).format(new Date(member.createdAt)).slice(0, -1)}</li>
                            <li><button className="member-del-btn" onClick={() => openDeleteInModal(member.id)}>삭제</button></li>
                        </ul>

                    ))
                )}
            </div>
            {isOpenMdoal && (
                <Modal isOpen={isOpenMdoal} onClose={closeDelteModal} title="유저 삭제" actions={
                    <div className="delete-confirm">
                        <button onClick={handleDeleteUser} className="delete-confirm-btn" >삭제</button>
                        <button onClick={closeDelteModal} className="delete-cancel-btn">취소</button>
                    </div>
                }>
                    <div className="delete-content">유저를 삭제하면 되돌릴 수 없어요😥 정말 삭제하시겠어요?</div>
                </Modal>
            )}
        </div>
    );
}

export default MemberList;